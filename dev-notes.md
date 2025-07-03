 Prompt to Guide UI Enhancement for ChillyMovies
I’m building a desktop application called ChillyMovies. Its core features include:

🎬 Movie Downloads with search, metadata display, and quality selection.

📺 TV Series Downloads, where users can download:

Single episodes

Full seasons

All available seasons

🎥 YouTube Video Downloads by pasting a URL:

Choose quality (e.g., 720p, 1080p)

Option to download audio-only

The app is built using Electron, React, and TailwindCSS for a modern desktop UI. It uses the TMDB API for movie/TV metadata.

I already have a basic UI layout template, but I want your help to guide me on enhancing the user interface. I don’t want code. I want a set of UI/UX guidelines and suggestions that I (or an AI agent) can follow consistently throughout development.

Please provide:

Recommended UI libraries, design systems, or frameworks that fit a modern, minimalistic, and clean desktop app.

Best practices for component styling, spacing, typography, layout, and responsiveness, especially for a desktop-first experience.

Suggestions on dark/light mode implementation, font choices, and icon systems.

Tools or utilities to ensure consistent design across all components and pages.

Guidelines to make the app feel professional, intuitive, and smooth, especially when dealing with search, modals, download options, and long content lists (e.g., series episodes).

Please align all suggestions with the intended feel of ChillyMovies: minimal, elegant, efficient, and user-friendly for anyone who just wants to search, preview, and download content easily.


# ChillyMovies Development Notes

## Project Overview
ChillyMovies is a desktop application that allows users to download movies, TV shows, and YouTube videos through a clean, fast, and modern UI. The app is built using Electron, React (with TypeScript), and TailwindCSS. It also integrates with TMDB for metadata and uses tools like `youtube-dl` for media downloads.

## Core Features

### 🎬 Movie Downloads
- ✅ Search for movies using TMDB API
- ✅ View movie details in modal or panel
- ✅ Choose download quality (480p, 720p, 1080p)
- 🔲 Implement download logic using magnet/torrent or direct source

### 📺 TV Series Downloads
- ✅ Search for TV series
- ✅ Select specific episode(s), a full season, or all seasons
- ✅ Choose resolution per episode or batch
- 🔲 Fetch episode data from TMDB and handle folder-based download targets

### 🎥 YouTube Video Downloads
- ✅ Paste a YouTube URL
- ✅ Fetch video/audio formats
- ✅ Select video quality or audio-only
- 🔲 Enable download via `youtube-dl-exec` or similar

## UI/UX Goals
- Modern and minimalistic look
- Dark theme with proper accessibility contrast
- Clean navigation between Movies, Series, and YouTube
- Responsive grid for search results
- Smooth modals with content previews
- Easy access to quality options and download actions

## Tech Stack
- Electron
- React + TypeScript
- TailwindCSS (utility-first CSS)
- Radix UI or ShadCN UI for components
- TMDB API
- youtube-dl-exec

## Dependencies to Install
- `electron`
- `react`, `react-dom`
- `tailwindcss`, `postcss`, `autoprefixer`
- `tmdb-v3` or direct Axios-based fetches
- `youtube-dl-exec`
- `shadcn/ui` (recommended component library)
- `lucide-react` or `react-icons` for iconography

## Development Status

### Completed
- [x] UI Template with dark mode
- [x] Movie/TV Search components
- [x] Basic layout setup

### In Progress
- [ ] YouTube download UI (input + format selection)
- [ ] Download handler logic and file manager

### Upcoming Tasks
- [ ] Implement episode-season selector with checkboxes
- [ ] Create unified download manager with queue
- [ ] Add user preferences (e.g., download path, theme)
- [ ] Show download progress + error handling
- [ ] Add context log system (`context.md`) for tracking updates and tasks

## API Keys
- ✅ TMDB API Key: `386aa4c00cab24cbf81e593a99cd359e`
- 🔲 YouTube API Key (optional, for metadata lookup)

## Notes
- All updates and progress should be logged in `context.md` with timestamps and brief notes.
- Keep UI enhancements consistent by following design guidelines provided by the prompt.
