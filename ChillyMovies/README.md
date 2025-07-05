# ChillyMovies - Desktop Media Downloader

A powerful desktop application for downloading movies, TV shows, and YouTube videos with a beautiful and modern UI.

## Features

🎬 **Movie Downloads**
- Search for movies using TMDB API
- View movie details and ratings
- Select download quality (480p, 720p, 1080p, 4K)
- Download via torrent/magnet links

📺 **TV Series Downloads**  
- Search for TV series
- Browse seasons and episodes
- Download individual episodes or entire seasons
- Batch download with quality selection

🎥 **YouTube Downloads**
- Download videos by URL
- Choose video quality or audio-only
- Support for multiple formats
- Fast and reliable downloads

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ChillyMovies
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # .env file is already configured with TMDB API key
   # No additional setup needed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run as Electron app (optional)**
   ```bash
   npm run dev:electron
   ```

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run dev:electron` - Run both Vite and Electron concurrently
- `npm run build` - Build for production
- `npm run build:electron` - Compile Electron TypeScript files
- `npm run electron:build` - Build complete Electron app for distribution
- `npm run lint` - Run ESLint
- `npm run start` - Start Electron app (production mode)

## Development

### Architecture
- **Frontend**: React + TypeScript + Vite
- **Desktop**: Electron
- **Styling**: Tailwind CSS
- **API**: TMDB for movie/TV metadata
- **Downloads**: WebTorrent + YouTube-DL

### Project Structure
```
ChillyMovies/
├── src/
│   ├── components/
│   │   ├── features/     # Feature components
│   │   ├── ui/          # Reusable UI components
│   │   └── layout/      # Layout components
│   ├── lib/             # API clients and utilities
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main application component
├── electron/
│   ├── main.ts          # Electron main process
│   ├── preload.ts       # Preload script
│   ├── downloadManager.ts # Download handling
│   └── store.ts         # Electron store configuration
└── public/              # Static assets
```

### Key Technologies
- **React 19** with hooks and modern patterns
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Electron** for desktop app functionality
- **Vite** for fast development and building
- **TMDB API** for movie/TV show metadata
- **WebTorrent** for torrent downloads
- **YouTube-DL** for YouTube video downloads

## Building for Production

### Web Build
```bash
npm run build
```

### Desktop App Build
```bash
npm run electron:build
```

This will create distributable packages for:
- Windows (NSIS installer)
- macOS (DMG)
- Linux (AppImage, DEB)

## Troubleshooting

### Common Issues

1. **Dev server won't start**
   - Ensure all dependencies are installed: `npm install`
   - Check if port 5173 is available

2. **Electron build fails**
   - Run `npm run build:electron` first
   - Ensure TypeScript compilation is successful

3. **Downloads not working**
   - Check internet connection
   - Verify TMDB API key in .env file
   - Ensure download directory is writable

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Review the Electron main process logs
3. Verify all dependencies are correctly installed
4. Ensure environment variables are properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Status

✅ **Ready for Development & Testing**

The application has been thoroughly tested and all major issues have been resolved. You can now:
- Run the development server without errors
- Build the application for production
- Package it as a desktop application
- Use all core features (movie/TV/YouTube downloads)

## Technical Notes

- Built with modern React patterns and hooks
- Fully typed with TypeScript
- Responsive design with Tailwind CSS
- Cross-platform desktop app with Electron
- Integrated with TMDB API for metadata
- Supports multiple download sources and formats
