import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  full_name: string
  role: 'owner' | 'manager' | 'cashier' | 'accountant' | 'hr'
  avatar_url?: string
  language_preference: 'en' | 'si' | 'ta'
}

interface Organization {
  id: string
  name: string
  name_si?: string
  name_ta?: string
  business_type: string
  plan: 'starter' | 'growth' | 'chain'
  logo_url?: string
  vat_number?: string
}

interface Branch {
  id: string
  name: string
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
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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

      logout: () =>
        set({
          user: null,
          organization: null,
          branch: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'ceylonmart-auth',
    }
  )
)
