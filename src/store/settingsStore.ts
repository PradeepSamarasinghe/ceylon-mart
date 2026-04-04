import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'en' | 'si' | 'ta'

interface SettingsState {
  language: Language
  sidebarCollapsed: boolean
  sidebarOpen: boolean // for mobile

  setLanguage: (lang: Language) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      sidebarCollapsed: false,
      sidebarOpen: false,

      setLanguage: (language) => set({ language }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarOpen: (sidebarOpen) =>
        set({ sidebarOpen }),
    }),
    {
      name: 'ceylonmart-settings',
    }
  )
)
