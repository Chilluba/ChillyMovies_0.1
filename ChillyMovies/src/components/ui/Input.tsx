import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  error?: string
  label?: string
}

export const Input = ({
  icon,
  error,
  label,
  className = '',
  ...props
}: InputProps) => {
  const baseStyles = 'flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-text-primary focus:outline-0 focus:ring-0 border border-secondary bg-primary focus:border-accent h-12 placeholder:text-text-secondary px-4'
  
  const combinedClassName = `${baseStyles} ${error ? 'border-red-500' : ''} ${className}`
  
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-text-secondary">
            {icon}
          </div>
        )}
        <input
          className={`${combinedClassName} ${icon ? 'pl-12' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
