const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the app
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Basic IPC handlers for settings
ipcMain.handle('settings:get', async () => {
  return { 
    success: true, 
    settings: {
      downloadPath: app.getPath('downloads'),
      language: 'en',
      maxConcurrentDownloads: 3,
      autoStartDownloads: false,
      defaultQuality: '720p',
      theme: 'system',
    }
  };
});

ipcMain.handle('settings:update', async (event, { key, value }) => {
  console.log('Settings update:', key, value);
  return { success: true };
});

ipcMain.handle('settings:reset', async () => {
  return { success: true };
});

ipcMain.handle('download:selectDirectory', async () => {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
      title: 'Select Download Location',
      buttonLabel: 'Select Folder',
    });

    if (canceled || filePaths.length === 0) {
      return { success: false };
    }

    return { success: true, path: filePaths[0] };
  } catch (err) {
    console.error('Failed to select directory:', err);
    return { success: false, error: err.message };
  }
});

// Basic download handlers (stub implementations)
ipcMain.handle('download:start', async (event, request) => {
  console.log('Download start:', request);
  return { success: true, downloadId: request.contentId };
});

ipcMain.handle('download:pause', (event, downloadId) => {
  console.log('Download pause:', downloadId);
  return { success: true };
});

ipcMain.handle('download:resume', (event, downloadId) => {
  console.log('Download resume:', downloadId);
  return { success: true };
});

ipcMain.handle('download:cancel', (event, downloadId) => {
  console.log('Download cancel:', downloadId);
  return { success: true };
});

ipcMain.handle('download:getAll', () => {
  return [];
});