export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: 'owner' | 'manager' | 'cashier' | 'accountant' | 'hr'
          language_preference: 'en' | 'si' | 'ta'
          organization_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role?: 'owner' | 'manager' | 'cashier' | 'accountant' | 'hr'
          language_preference?: 'en' | 'si' | 'ta'
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: 'owner' | 'manager' | 'cashier' | 'accountant' | 'hr'
          language_preference?: 'en' | 'si' | 'ta'
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          name_si: string | null
          name_ta: string | null
          business_type: string
          plan: 'starter' | 'growth' | 'chain'
          logo_url: string | null
          vat_number: string | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_si?: string | null
          name_ta?: string | null
          business_type: string
          plan?: 'starter' | 'growth' | 'chain'
          logo_url?: string | null
          vat_number?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_si?: string | null
          name_ta?: string | null
          business_type?: string
          plan?: 'starter' | 'growth' | 'chain'
          logo_url?: string | null
          vat_number?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      branches: {
        Row: {
          id: string
          name: string
          address: string | null
          is_headquarters: boolean
          organization_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          is_headquarters?: boolean
          organization_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          is_headquarters?: boolean
          organization_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

