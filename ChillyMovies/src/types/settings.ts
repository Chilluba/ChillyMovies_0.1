export interface Settings {
  downloadPath: string
  language: 'en' | 'es' | 'fr' | 'de'
  maxConcurrentDownloads: number
  autoStartDownloads: boolean
  defaultQuality: '480p' | '720p' | '1080p' | '4k'
  theme: 'dark' | 'light' | 'system'
}

export interface UpdateSettingsRequest {
  key: keyof Settings
  value: Settings[keyof Settings]
}

export interface SettingsResponse {
  success: boolean
  settings?: Settings
  error?: string
}
