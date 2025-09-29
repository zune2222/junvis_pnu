export interface Feature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange'
}

export interface AppConfig {
  name: string
  description: string
  version: string
}

export type ThemeMode = 'light' | 'dark' | 'system'