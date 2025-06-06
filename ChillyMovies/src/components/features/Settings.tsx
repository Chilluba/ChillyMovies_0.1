import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface SettingsValues {
  downloadPath: string
  language: 'en' | 'es' | 'fr' | 'de'
  maxConcurrentDownloads: number
  autoStartDownloads: boolean
  defaultQuality: '480p' | '720p' | '1080p' | '4k'
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' }
] as const

const QUALITY_OPTIONS = [
  { value: '480p', label: '480p' },
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
  { value: '4k', label: '4K' }
] as const

export const Settings = () => {
  const [settings, setSettings] = useState<SettingsValues>({
    downloadPath: localStorage.getItem('downloadPath') || '',
    language: (localStorage.getItem('language') as SettingsValues['language']) || 'en',
    maxConcurrentDownloads: Number(localStorage.getItem('maxConcurrentDownloads')) || 3,
    autoStartDownloads: localStorage.getItem('autoStartDownloads') === 'true',
    defaultQuality: (localStorage.getItem('defaultQuality') as SettingsValues['defaultQuality']) || '720p'
  })

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState(false)

  const handleDownloadPathSelect = async () => {
    try {
      const result = await window.electron.downloadManager.selectDirectory()
      if (result.success && result.path) {
        setSettings(prev => ({ ...prev, downloadPath: result.path! }))
      }
    } catch (err) {
      setError('Failed to select download path')
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(undefined)
    setSuccess(false)

    try {
      // Validate settings
      if (!settings.downloadPath) {
        throw new Error('Download path is required')
      }

      if (settings.maxConcurrentDownloads < 1 || settings.maxConcurrentDownloads > 10) {
        throw new Error('Max concurrent downloads must be between 1 and 10')
      }

      // Save to localStorage
      Object.entries(settings).forEach(([key, value]) => {
        localStorage.setItem(key, String(value))
      })

      // TODO: Save to electron-store when implemented
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    const defaultSettings: SettingsValues = {
      downloadPath: '',
      language: 'en',
      maxConcurrentDownloads: 3,
      autoStartDownloads: false,
      defaultQuality: '720p'
    }

    setSettings(defaultSettings)
    Object.entries(defaultSettings).forEach(([key, value]) => {
      localStorage.setItem(key, String(value))
    })
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-text-secondary">Configure your download preferences</p>
      </div>

      <div className="flex flex-col gap-6 rounded-xl border border-secondary bg-primary p-6">
        {/* Download Path */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Download Location
          </label>
          <div className="flex gap-2">
            <Input
              value={settings.downloadPath}
              placeholder="Select download folder"
              readOnly
            />
            <Button onClick={handleDownloadPathSelect}>
              Browse
            </Button>
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Language
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSettings(prev => ({ ...prev, language: value }))}
                className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
                  settings.language === value
                    ? 'border-accent text-white'
                    : 'border-secondary text-text-secondary hover:border-white hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Default Quality */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Default Quality
          </label>
          <div className="flex flex-wrap gap-2">
            {QUALITY_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSettings(prev => ({ ...prev, defaultQuality: value }))}
                className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
                  settings.defaultQuality === value
                    ? 'border-accent text-white'
                    : 'border-secondary text-text-secondary hover:border-white hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Max Concurrent Downloads */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Max Concurrent Downloads
          </label>
          <Input
            type="number"
            min={1}
            max={10}
            value={settings.maxConcurrentDownloads}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              maxConcurrentDownloads: Math.min(10, Math.max(1, Number(e.target.value)))
            }))}
          />
        </div>

        {/* Auto-start Downloads */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autoStart"
            checked={settings.autoStartDownloads}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              autoStartDownloads: e.target.checked
            }))}
            className="h-4 w-4 rounded border-secondary bg-primary text-accent focus:ring-accent"
          />
          <label htmlFor="autoStart" className="text-sm font-medium text-white">
            Auto-start downloads when added
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {success && (
          <p className="text-sm text-green-500">Settings saved successfully</p>
        )}

        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={isSaving}
          >
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  )
}
