export interface MovieResult {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
}

export interface TVShowResult {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  number_of_seasons: number
}

export interface TVShowResponse extends TVShowResult {
  seasons: TVShowSeason[]
  status: string
  networks: { name: string }[]
  genres: { id: number; name: string }[]
  episode_run_time: number[]
}

export interface TVShowSeason {
  id: number
  name: string
  overview: string
  poster_path: string | null
  air_date: string
  season_number: number
  episode_count: number
  episodes?: TVShowEpisode[]
}

export interface TVShowEpisode {
  id: number
  name: string
  overview: string
  still_path: string | null
  air_date: string
  episode_number: number
  season_number: number
  runtime: number
  vote_average: number
}

export interface SearchResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export type MovieSearchResponse = SearchResponse<MovieResult>
export type TVShowSearchResponse = SearchResponse<TVShowResult>

export interface TMDBConfig {
  images: {
    base_url: string
    secure_base_url: string
    backdrop_sizes: string[]
    logo_sizes: string[]
    poster_sizes: string[]
    profile_sizes: string[]
    still_sizes: string[]
  }
}

export interface VideoQuality {
  id: string
  label: string
  width: number
  height: number
}

export type ContentType = 'movie' | 'tv' | 'youtube'

export interface DownloadOptions {
  quality: VideoQuality
  audioOnly?: boolean
  subtitles?: boolean
  type: ContentType
  id: string | number
}
