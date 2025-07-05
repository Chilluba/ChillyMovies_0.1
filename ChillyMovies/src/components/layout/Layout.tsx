import { useState, type ReactNode } from 'react'
import { Settings } from '../features/Settings'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const [currentPage, setCurrentPage] = useState<'home' | 'settings'>('home')
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-background dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary px-10 py-3">
          <div className="flex items-center gap-4 text-text-primary">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em]">ChillyMovies</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <nav className="flex items-center gap-9">
              <button
                onClick={() => setCurrentPage('home')}
                className={`text-sm font-medium leading-normal ${currentPage === 'home' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('settings')}
                className={`text-sm font-medium leading-normal ${currentPage === 'settings' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Settings
              </button>
            </nav>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-primary text-text-primary gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <div className="text-text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                </svg>
              </div>
            </button>
          </div>
        </header>
        <main className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {currentPage === 'home' ? children : <Settings />}
          </div>
        </main>
      </div>
    </div>
  )
}
