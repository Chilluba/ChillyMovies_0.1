import { type HTMLAttributes } from 'react'

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
}

export const LoadingSpinner = ({ size = 'md', className = '', ...props }: LoadingSpinnerProps) => (
  <div
    className={`animate-spin rounded-full border-2 border-current border-t-transparent text-white ${sizes[size]} ${className}`}
    {...props}
  />
)
