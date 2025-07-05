# ChillyMovies Desktop App 🎬

A powerful desktop application for downloading movies, TV shows, and YouTube videos built with Electron and React.

## Features ✨

- **Movie & TV Show Search**: Search and browse movies and TV series using TMDB API
- **YouTube Video Download**: Download YouTube videos with quality selection
- **Quality Selection**: Choose from different video qualities (480p, 720p, 1080p, 4K)
- **Download Management**: Queue, pause, resume, and cancel downloads
- **Modern UI**: Beautiful, responsive interface with dark theme
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Quick Start 🚀

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   cd ChillyMovies
   npm install
   ```

2. **Configure TMDB API (Optional)**
   - Create a `.env` file in the root directory
   - Add your TMDB API key:
     ```
     VITE_TMDB_API_KEY=your_tmdb_api_key_here
     ```
   - Get your API key from [TMDB](https://www.themoviedb.org/settings/api)

3. **Start the Application**
   ```bash
   # Using the startup script (recommended)
   ./start-app.sh
   
   # Or manually
   npm run build
   npm start
   ```

## Usage 📱

### Searching for Content
1. Select content type: Movies, TV Series, or YouTube
2. Enter search terms in the search bar
3. Browse results and click on items for details

### Downloading Movies/TV Shows
1. Click on a movie or TV show from search results
2. Select your preferred quality
3. Click "Download" to start the download

### YouTube Downloads
1. Switch to the YouTube tab
2. Paste a YouTube URL
3. Select quality and format options
4. Click "Download"

### Managing Downloads
- View all downloads in the Download Manager
- Pause, resume, or cancel downloads as needed
- Monitor download progress and speed

## Development 🛠️

### Project Structure
```
ChillyMovies/
├── src/                    # React source code
│   ├── components/         # React components
│   ├── lib/               # Utilities and API clients
│   └── types/             # TypeScript type definitions
├── electron/              # Electron main process code
├── dist-electron/         # Compiled Electron files
├── dist/                  # Built React app
└── public/               # Static assets
```

### Available Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build React app for production
- `npm start` - Start Electron app
- `npm run lint` - Run ESLint
- `npm run build:electron` - Compile Electron TypeScript files

### Development Mode
```bash
# Terminal 1: Start React dev server
npm run dev

# Terminal 2: Start Electron (after updating main.js to use localhost:5173)
npm start
```

## Configuration ⚙️

### Environment Variables
Create a `.env` file with the following variables:

```env
# TMDB API Key (required for movie/TV search)
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

### Settings
The app includes a settings panel where you can configure:
- Download location
- Maximum concurrent downloads
- Default video quality
- Theme preferences
- Language settings

## Troubleshooting 🔧

### Common Issues

1. **App won't start**
   - Make sure all dependencies are installed: `npm install`
   - Try rebuilding: `npm run build`
   - Check that Node.js version is 16 or higher

2. **Search not working**
   - Verify your TMDB API key is correctly set in `.env`
   - Check internet connection
   - API key should be valid and not rate-limited

3. **Downloads failing**
   - Ensure you have write permissions to the download directory
   - Check available disk space
   - Some content may not be available for download

4. **Linux Display Issues**
   - Warnings about dbus and GLX are normal in headless environments
   - The app should still function properly despite these warnings

### Linux Specific
If you encounter sandbox issues on Linux:
```bash
# The app already includes --no-sandbox flag
# If you still have issues, try:
electron . --no-sandbox --disable-gpu --disable-dev-shm-usage
```

## Building for Production 📦

To create distributable packages:

```bash
# Build the React app
npm run build

# Build Electron files
npm run build:electron

# Create distributable (requires electron-builder setup)
npm run electron:build
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer ⚠️

This application is for educational purposes only. Please respect copyright laws and terms of service of content providers. Only download content that you have the right to download.

## Support 💬

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information

---

**Made with ❤️ by the ChillyMovies Team**
