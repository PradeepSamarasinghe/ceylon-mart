import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  full_name: string
  role: 'owner' | 'manager' | 'cashier' | 'accountant' | 'hr'
  avatar_url?: string | null
  language_preference: 'en' | 'si' | 'ta'
  organization_id?: string | null
}

interface Organization {
  id: string
  name: string
  name_si?: string | null
  name_ta?: string | null
  business_type: string
  plan: 'starter' | 'growth' | 'chain'
  logo_url?: string | null
  vat_number?: string | null
}

interface Branch {
  id: string
  name: string
  address?: string | null
  is_headquarters: boolean
}

interface AuthState {
  user: User | null
  organization: Organization | null
  branch: Branch | null
  isAuthenticated: boolean
  isLoading: boolean

  setUser: (user: User | null) => void
  setOrganization: (org: Organization | null) => void
  setBranch: (branch: Branch | null) => void
  setLoading: (loading: boolean) => void
  logout: () => Promise<void>
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      organization: null,
      branch: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

      setOrganization: (organization) =>
        set({ organization }),

      setBranch: (branch) =>
        set({ branch }),

      setLoading: (isLoading) =>
        set({ isLoading }),

      logout: async () => {
        await supabase.auth.signOut()
        set({
          user: null,
          organization: null,
          branch: null,
          isAuthenticated: false,
        })
      },

      initializeAuth: async () => {
        set({ isLoading: true })
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Fetch profile and organization
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, organization:organizations(*)')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            const { organization, ...userProfile } = profile as any
            set({ 
              user: userProfile, 
              organization: organization || null,
              isAuthenticated: true 
            })

            // If organization exists, fetch default/HQ branch
            if (organization) {
              const { data: branch } = await supabase
                .from('branches')
                .select('*')
                .eq('organization_id', organization.id)
                .eq('is_headquarters', true)
                .single()
              
              if (branch) set({ branch })
            }
          }
        }

        set({ isLoading: false })

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
             const { data: profile } = await supabase
              .from('profiles')
              .select('*, organization:organizations(*)')
              .eq('id', session.user.id)
              .single()
            
            if (profile) {
              const { organization, ...userProfile } = profile as any
               set({ 
                user: userProfile, 
                organization: organization || null,
                isAuthenticated: true 
              })
            }
          } else if (event === 'SIGNED_OUT') {
            set({ user: null, organization: null, branch: null, isAuthenticated: false })
          }
        })
      }
    }),
    {
      name: 'ceylonmart-auth',
      partialize: (state) => ({ 
        user: state.user, 
        organization: state.organization, 
        branch: state.branch,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

