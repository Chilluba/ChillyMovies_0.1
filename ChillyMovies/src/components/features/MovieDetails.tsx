import { useState } from 'react'
import type { MovieResult, VideoQuality } from '../../types/api'
import { Button } from '../ui/Button'
import { tmdbApi } from '../../lib/tmdb'

const QUALITY_OPTIONS: VideoQuality[] = [
  { id: '480p', label: '480p', width: 854, height: 480 },
  { id: '720p', label: '720p', width: 1280, height: 720 },
  { id: '1080p', label: '1080p', width: 1920, height: 1080 },
  { id: '4k', label: '4K', width: 3840, height: 2160 },
]

interface MovieDetailsProps {
  movie: MovieResult
  onClose: () => void
  onDownload: (quality: VideoQuality) => void
}

export const MovieDetails = ({ movie, onClose, onDownload }: MovieDetailsProps) => {
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>(QUALITY_OPTIONS[1]) // Default to 720p

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-background">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[2/3] md:aspect-auto">
            <img
              src={movie.poster_path ? tmdbApi.getImageUrl(movie.poster_path, 'w780') : '/placeholder.jpg'}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent md:hidden" />
          </div>

          <div className="flex flex-col gap-6 p-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
              <p className="mt-2 text-text-secondary">
                {new Date(movie.release_date).getFullYear()} • {movie.vote_average.toFixed(1)} ⭐
              </p>
            </div>

            <p className="text-text-secondary">{movie.overview}</p>

            <div className="flex flex-col gap-4">
              <h3 className="font-medium text-white">Select Quality</h3>
              <div className="flex flex-wrap gap-2">
                {QUALITY_OPTIONS.map((quality) => (
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

            <div className="mt-auto flex flex-wrap gap-4">
              <Button
                variant="primary"
                onClick={() => onDownload(selectedQuality)}
                className="flex-1"
              >
                Download
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
