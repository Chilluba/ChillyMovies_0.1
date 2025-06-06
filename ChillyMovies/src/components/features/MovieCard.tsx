import type { MovieResult, TVShowResult } from '../../types/api'
import { tmdbApi } from '../../lib/tmdb'

interface MovieCardProps {
  item: MovieResult | TVShowResult
  onSelect: (item: MovieResult | TVShowResult) => void
}

export const MovieCard = ({ item, onSelect }: MovieCardProps) => {
  const isMovie = 'title' in item
  const title = isMovie ? item.title : item.name
  const date = isMovie ? item.release_date : item.first_air_date

  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-xl bg-primary transition-transform hover:scale-[1.02] cursor-pointer"
      onClick={() => onSelect(item)}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={item.poster_path ? tmdbApi.getImageUrl(item.poster_path, 'w500') : '/placeholder.jpg'}
          alt={title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-bold text-white line-clamp-1">{title}</h3>
        <p className="text-sm text-text-secondary line-clamp-2">{item.overview}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {date ? new Date(date).getFullYear() : 'N/A'}
          </span>
          <span className="flex items-center gap-1 text-sm text-text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"/>
            </svg>
            {item.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  )
}
