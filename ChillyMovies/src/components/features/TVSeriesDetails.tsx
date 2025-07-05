import { useState, useEffect } from 'react'
import type { TVShowResponse, TVShowSeason, TVShowEpisode, VideoQuality } from '../../types/api'
import { Button } from '../ui/Button'
import { tmdbApi } from '../../lib/tmdb'

const QUALITY_OPTIONS: VideoQuality[] = [
  { id: '480p', label: '480p', width: 854, height: 480 },
  { id: '720p', label: '720p', width: 1280, height: 720 },
  { id: '1080p', label: '1080p', width: 1920, height: 1080 },
  { id: '4k', label: '4K', width: 3840, height: 2160 },
]

interface TVSeriesDetailsProps {
  show: TVShowResponse
  onClose: () => void
  onDownload: (episodes: TVShowEpisode[], quality: VideoQuality) => void
}

export const TVSeriesDetails = ({ show, onClose, onDownload }: TVSeriesDetailsProps) => {
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>(QUALITY_OPTIONS[1]) // Default to 720p
  const [loadingSeasons, setLoadingSeasons] = useState<{ [key: number]: boolean }>({})
  const [selectedEpisodes, setSelectedEpisodes] = useState<{ [key: number]: boolean }>({})
  const [expandedSeasons, setExpandedSeasons] = useState<{ [key: number]: boolean }>({})
  const [seasonsWithEpisodes, setSeasonsWithEpisodes] = useState<TVShowSeason[]>([])

  useEffect(() => {
    const loadInitialSeasons = async () => {
      // Load the first season by default
      if (show.seasons && show.seasons.length > 0) {
        await loadSeasonEpisodes(show.seasons[0].season_number)
      }
    }
    loadInitialSeasons()
  }, [show])

  const loadSeasonEpisodes = async (seasonNumber: number) => {
    if (loadingSeasons[seasonNumber]) return

    setLoadingSeasons(prev => ({ ...prev, [seasonNumber]: true }))
    try {
      const seasonData = await tmdbApi.getTVShowSeason(show.id, seasonNumber)
      setSeasonsWithEpisodes(prev => {
        const otherSeasons = prev.filter(s => s.season_number !== seasonNumber)
        return [...otherSeasons, seasonData].sort((a, b) => a.season_number - b.season_number)
      })
      setExpandedSeasons(prev => ({ ...prev, [seasonNumber]: true }))
    } catch (err) {
      console.error('Failed to load season:', err)
    } finally {
      setLoadingSeasons(prev => ({ ...prev, [seasonNumber]: false }))
    }
  }

  const toggleEpisode = (episode: TVShowEpisode) => {
    setSelectedEpisodes(prev => ({
      ...prev,
      [episode.id]: !prev[episode.id]
    }))
  }

  const toggleSeason = (season: TVShowSeason) => {
    if (!season.episodes) {
      loadSeasonEpisodes(season.season_number)
      return
    }

    const isSeasonSelected = season.episodes.every(ep => selectedEpisodes[ep.id])
    const newSelectedEpisodes = { ...selectedEpisodes }

    season.episodes.forEach(ep => {
      newSelectedEpisodes[ep.id] = !isSeasonSelected
    })

    setSelectedEpisodes(newSelectedEpisodes)
  }

  const handleDownload = () => {
    const episodesToDownload = seasonsWithEpisodes
      .flatMap(season => season.episodes || [])
      .filter(episode => selectedEpisodes[episode.id])

    if (episodesToDownload.length > 0) {
      onDownload(episodesToDownload, selectedQuality)
    }
  }

  const selectedEpisodeCount = Object.values(selectedEpisodes).filter(Boolean).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-background">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-text-primary hover:bg-black/70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[2/3] md:aspect-auto">
            <img
              src={show.poster_path ? tmdbApi.getImageUrl(show.poster_path, 'w780') : '/placeholder.jpg'}
              alt={show.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent md:hidden" />
          </div>

          <div className="flex max-h-[90vh] flex-col gap-6 p-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">{show.name}</h2>
              <p className="mt-2 text-text-secondary">
                {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A'} • {show.vote_average.toFixed(1)} ⭐
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-medium text-text-primary">Select Quality</h3>
              <div className="flex flex-wrap gap-2">
                {QUALITY_OPTIONS.map((quality) => (
                  <button
                    key={quality.id}
                    onClick={() => setSelectedQuality(quality)}
                    className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
                      selectedQuality.id === quality.id
                        ? 'border-accent text-text-primary'
                        : 'border-secondary text-text-secondary hover:border-accent hover:text-text-primary'
                    }`}
                  >
                    {quality.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <h3 className="mb-4 font-medium text-text-primary">Select Episodes</h3>
              <div className="flex flex-col gap-4">
                {show.seasons.map((season) => {
                  const seasonWithEpisodes = seasonsWithEpisodes.find(s => s.season_number === season.season_number)
                  const isExpanded = expandedSeasons[season.season_number]
                  const isLoading = loadingSeasons[season.season_number]

                  return (
                    <div key={season.id} className="rounded-xl border border-secondary bg-primary p-4">
                      <button
                        onClick={() => toggleSeason(season)}
                        className="flex w-full items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={seasonWithEpisodes?.episodes?.every(ep => selectedEpisodes[ep.id]) || false}
                            onChange={() => {}}
                            ref={el => {
                              if (el && seasonWithEpisodes?.episodes) {
                                const someSelected = seasonWithEpisodes.episodes.some(ep => selectedEpisodes[ep.id]);
                                const allSelected = seasonWithEpisodes.episodes.every(ep => selectedEpisodes[ep.id]);
                                el.indeterminate = someSelected && !allSelected;
                              }
                            }}
                            className="h-4 w-4 rounded border-secondary bg-primary text-accent focus:ring-accent"
                          />
                          <div>
                            <h4 className="text-left font-medium text-text-primary">
                              Season {season.season_number}
                            </h4>
                            <p className="text-sm text-text-secondary">
                              {season.episode_count} Episodes
                            </p>
                          </div>
                        </div>
                        {isLoading ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent text-text-primary" />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`transform text-text-primary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          >
                            <path d="M5 7.5L10 12.5L15 7.5" />
                          </svg>
                        )}
                      </button>

                      {isExpanded && seasonWithEpisodes?.episodes && (
                        <div className="mt-4 flex flex-col gap-2">
                          {seasonWithEpisodes.episodes.map((episode) => (
                            <label
                              key={episode.id}
                              className="flex cursor-pointer items-center gap-3 rounded-lg border border-secondary p-3 hover:border-accent"
                            >
                              <input
                                type="checkbox"
                                checked={selectedEpisodes[episode.id] || false}
                                onChange={() => toggleEpisode(episode)}
                                className="h-4 w-4 rounded border-secondary bg-primary text-accent focus:ring-accent"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-text-primary">
                                  {episode.episode_number}. {episode.name}
                                </p>
                                <p className="text-sm text-text-secondary line-clamp-1">
                                  {episode.overview || 'No description available'}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-auto flex flex-wrap gap-4">
              <Button
                variant="primary"
                disabled={selectedEpisodeCount === 0}
                onClick={handleDownload}
                className="flex-1"
              >
                Download {selectedEpisodeCount > 0 ? `(${selectedEpisodeCount})` : ''}
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
