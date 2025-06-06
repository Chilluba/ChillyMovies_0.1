import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import type { VideoQuality } from '../../types/api'

const YOUTUBE_QUALITY_OPTIONS: VideoQuality[] = [
  { id: '144p', label: '144p', width: 256, height: 144 },
  { id: '240p', label: '240p', width: 426, height: 240 },
  { id: '360p', label: '360p', width: 640, height: 360 },
  { id: '480p', label: '480p', width: 854, height: 480 },
  { id: '720p', label: '720p', width: 1280, height: 720 },
  { id: '1080p', label: '1080p', width: 1920, height: 1080 }
]

export const YoutubeDownloader = () => {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>(YOUTUBE_QUALITY_OPTIONS[4]) // Default to 720p
  const [audioOnly, setAudioOnly] = useState(false)
  const [error, setError] = useState<string>()

  const handleDownload = async () => {
    if (!url) {
      setError('Please enter a YouTube URL')
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
      const result = await window.electron.downloadManager.start({
        contentId: url,
        quality: selectedQuality,
        type: 'youtube',
        url: url
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      setUrl('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start download')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-white">YouTube Downloader</h3>
        <p className="text-text-secondary">Download videos from YouTube by pasting the URL</p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-secondary bg-primary p-6">
        <Input
          label="YouTube URL"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            setError(undefined)
          }}
          error={error}
        />

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-white">Format &amp; Quality</label>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => setAudioOnly(false)}
                className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
                  !audioOnly
                    ? 'border-accent text-white'
                    : 'border-secondary text-text-secondary hover:border-white hover:text-white'
                }`}
              >
                Video
              </button>
              <button
                onClick={() => setAudioOnly(true)}
                className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
                  audioOnly
                    ? 'border-accent text-white'
                    : 'border-secondary text-text-secondary hover:border-white hover:text-white'
                }`}
              >
                Audio Only
              </button>
            </div>
          </div>

          {!audioOnly && (
            <div>
              <div className="mt-2 flex flex-wrap gap-2">
                {YOUTUBE_QUALITY_OPTIONS.map((quality) => (
                  <button
                    key={quality.id}
                    onClick={() => setSelectedQuality(quality)}
                    className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
                      selectedQuality.id === quality.id
                        ? 'border-accent text-white'
                        : 'border-secondary text-text-secondary hover:border-white hover:text-white'
                    }`}
                  >
                    {quality.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-2">
          <Button
            variant="primary"
            disabled={!url || isLoading}
            onClick={handleDownload}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Processing...</span>
              </div>
            ) : audioOnly ? (
              'Download Audio'
            ) : (
              'Download Video'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
