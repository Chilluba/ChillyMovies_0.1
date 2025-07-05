import axios from 'axios'
import type { MovieSearchResponse, TVShowResponse, TVShowSearchResponse, TMDBConfig, TVShowSeason } from '../types/api'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'demo_key'
if (!import.meta.env.VITE_TMDB_API_KEY) {
  console.warn('TMDB API key is not configured. Please add VITE_TMDB_API_KEY to your .env file.')
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

const tmdbAxios = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY
  }
})

export const tmdbApi = {
  searchMovies: async (query: string, page = 1) => {
    const response = await tmdbAxios.get<MovieSearchResponse>('/search/movie', {
      params: {
        query,
        page
      }
    })
    return response.data
  },

  searchTVShows: async (query: string, page = 1) => {
    const response = await tmdbAxios.get<TVShowSearchResponse>('/search/tv', {
      params: {
        query,
        page
      }
    })
    return response.data
  },

  getTVShowDetails: async (id: number) => {
    const response = await tmdbAxios.get<TVShowResponse>(`/tv/${id}`)
    return response.data
  },

  getTVShowSeason: async (id: number, seasonNumber: number) => {
    const response = await tmdbAxios.get<TVShowSeason>(`/tv/${id}/season/${seasonNumber}`)
    return response.data
  },

  getConfiguration: async () => {
    const response = await tmdbAxios.get<TMDBConfig>('/configuration')
    return response.data
  },

  getImageUrl: (path: string, size = 'original') => {
    return `https://image.tmdb.org/t/p/${size}${path}`
  }
}
