#!/bin/bash

echo "🎬 Starting ChillyMovies Desktop App..."

# Build the React app
echo "📦 Building React app..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Start the Electron app
echo "🚀 Starting Electron app..."
echo "Note: You may see some warnings about dbus and GLX - these are normal in Linux environments"
echo "The app should start successfully despite these warnings."
echo ""

npm start