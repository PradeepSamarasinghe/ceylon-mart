import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'en' | 'si' | 'ta'

interface SettingsState {
  language: Language
  sidebarCollapsed: boolean
  sidebarOpen: boolean // for mobile
  darkMode: boolean

  setLanguage: (lang: Language) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleDarkMode: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      sidebarCollapsed: false,
      sidebarOpen: false,
      darkMode: true, // Default to Dark mode

      setLanguage: (language) => set({ language }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarOpen: (sidebarOpen) =>
        set({ sidebarOpen }),

      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'ceylonmart-settings',
    }
  )
)
