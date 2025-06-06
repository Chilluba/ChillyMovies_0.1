import type { MovieResult, TVShowResult } from '../../types/api'
import { MovieCard } from './MovieCard'

interface SearchResultsProps {
  results: (MovieResult | TVShowResult)[]
  isLoading: boolean
  error?: string
  onSelectMovie: (item: MovieResult | TVShowResult) => void
  type: 'movie' | 'tv'
}

export const SearchResults = ({ results, isLoading, error, onSelectMovie }: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-white" />
      </div>
    )
  }

  if (error) {      return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">{error}</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">No results found. Try a different search term.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {results.map((item) => (
        <MovieCard key={item.id} item={item} onSelect={onSelectMovie} />
      ))}
    </div>
  )
}
