import Store from 'electron-store'
import type { Settings } from '../src/types/settings'

const schema = {
  settings: {
    type: 'object',
    properties: {
      downloadPath: { type: 'string' },
      language: { type: 'string', enum: ['en', 'es', 'fr', 'de'] },
      maxConcurrentDownloads: { type: 'number', minimum: 1, maximum: 10 },
      autoStartDownloads: { type: 'boolean' },
      defaultQuality: { type: 'string', enum: ['480p', '720p', '1080p', '4k'] },
      theme: { type: 'string', enum: ['dark', 'light', 'system'] }
    },
    required: ['downloadPath', 'language', 'maxConcurrentDownloads', 'autoStartDownloads', 'defaultQuality', 'theme']
  }
}

const defaults: { settings: Settings } = {
  settings: {
    downloadPath: '',
    language: 'en',
    maxConcurrentDownloads: 3,
    autoStartDownloads: false,
    defaultQuality: '720p',
    theme: 'system'
  }
}

export const store = new Store({
  schema,
  defaults,
  watch: true // Watch for changes in the config file
})
