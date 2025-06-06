import { useState } from 'react'
import { Layout } from './components/layout/Layout'
import { SearchBar } from './components/features/SearchBar'
import { SearchResults } from './components/features/SearchResults'
import { MovieDetails } from './components/features/MovieDetails'
import { TVSeriesDetails } from './components/features/TVSeriesDetails'
import { DownloadManager } from './components/features/DownloadManager'
import { YoutubeDownloader } from './components/features/YoutubeDownloader'
import type { MovieResult, TVShowResult, TVShowResponse, VideoQuality, TVShowEpisode } from './types/api'
import { tmdbApi } from './lib/tmdb'
import './App.css'

import type { ElectronAPI } from './types/electron'

declare global {
  interface Window {
    electron: ElectronAPI
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [movieResults, setMovieResults] = useState<MovieResult[]>([])
  const [tvResults, setTVResults] = useState<TVShowResult[]>([])
  const [selectedMovie, setSelectedMovie] = useState<MovieResult>()
  const [selectedTVShow, setSelectedTVShow] = useState<TVShowResponse>()
  const [contentType, setContentType] = useState<'movie' | 'tv' | 'youtube'>('movie')

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setMovieResults([])
      setTVResults([])
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
      if (contentType === 'movie') {
        const data = await tmdbApi.searchMovies(query)
        setMovieResults(data.results)
        setTVResults([])
      } else if (contentType === 'tv') {
        const data = await tmdbApi.searchTVShows(query)
        setTVResults(data.results)
        setMovieResults([])
      }
    } catch (err) {
      setError(`Failed to search ${contentType === 'movie' ? 'movies' : 'TV shows'}. Please try again.`)
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMovieDownload = async (quality: VideoQuality) => {
    if (!selectedMovie) return

    try {
      const result = await window.electron.downloadManager.start({
        contentId: selectedMovie.id,
        quality,
        type: 'movie'
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      setSelectedMovie(undefined)
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  const handleTVShowDownload = async (episodes: TVShowEpisode[], quality: VideoQuality) => {
    if (!selectedTVShow || episodes.length === 0) return

    try {
      for (const episode of episodes) {
        const result = await window.electron.downloadManager.start({
          contentId: `${selectedTVShow.id}-s${episode.season_number}e${episode.episode_number}`,
          quality,
          type: 'tv'
        })

        if (!result.success) {
          throw new Error(result.error)
        }
      }

      setSelectedTVShow(undefined)
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  const handleShowDetails = async (tvShow: TVShowResult) => {
    try {
      const details = await tmdbApi.getTVShowDetails(tvShow.id)
      setSelectedTVShow(details)
    } catch (err) {
      console.error('Failed to fetch TV show details:', err)
    }
  }

  return (
    <Layout>
      <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
        Download your favorite content
      </h2>
      <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        {contentType === 'youtube' ? 'YouTube Video Download' : 'Search & Select'}
      </h3>
      <div className="flex gap-3 p-3 flex-wrap pr-4">
        <button
          onClick={() => setContentType('movie')}
          className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 ${
            contentType === 'movie' ? 'bg-accent text-white' : 'bg-primary text-text-secondary'
          }`}
        >
          Movies
        </button>
        <button
          onClick={() => setContentType('tv')}
          className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 ${
            contentType === 'tv' ? 'bg-accent text-white' : 'bg-primary text-text-secondary'
          }`}
        >
          TV Series
        </button>
        <button
          onClick={() => setContentType('youtube')}
          className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 ${
            contentType === 'youtube' ? 'bg-accent text-white' : 'bg-primary text-text-secondary'
          }`}
        >
          YouTube
        </button>
      </div>

      {contentType === 'youtube' ? (
        <div className="px-4 py-3">
          <YoutubeDownloader />
        </div>
      ) : (
        <>
          <div className="px-4 py-3">
            <SearchBar onSearch={handleSearch} placeholder={`Search for ${contentType === 'movie' ? 'movies' : 'TV series'}`} />
          </div>
          <div className="px-4 py-3">
            <SearchResults
              results={contentType === 'movie' ? movieResults : tvResults}
              isLoading={isLoading}
              error={error}
              onSelectMovie={(item) => {
                if (contentType === 'movie' && 'title' in item) {
                  setSelectedMovie(item)
                } else if (contentType === 'tv') {
                  handleShowDetails(item as TVShowResult)
                }
              }}
              type={contentType}
            />
          </div>
        </>
      )}

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(undefined)}
          onDownload={handleMovieDownload}
        />
      )}

      {selectedTVShow && (
        <TVSeriesDetails
          show={selectedTVShow}
          onClose={() => setSelectedTVShow(undefined)}
          onDownload={handleTVShowDownload}
        />
      )}

      <DownloadManager />
    </Layout>
  )
}

export default App
