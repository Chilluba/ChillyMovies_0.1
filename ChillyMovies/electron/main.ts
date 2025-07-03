import { app, BrowserWindow, ipcMain, dialog, nativeTheme } from 'electron';
import path from 'path';
import store from './store';
import DownloadManager from './downloadManager';

// Import types
import type { Settings, UpdateSettingsRequest } from '../src/types/settings';

// Initialize download manager
const downloadManager = new DownloadManager();

// Track active windows
const windows = new Set<BrowserWindow>();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#121416' : '#ffffff',
  });

  windows.add(win);
  win.on('closed', () => windows.delete(win));

  // In development, load from the dev server
  if (process.env.NODE_ENV !== 'production') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    // In production, load the built files
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Settings IPC handlers
ipcMain.handle('settings:get', async () => {
  try {
    const settings = (store as any).get('settings');
    return { success: true, settings };
  } catch (err) {
    console.error('Failed to get settings:', err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});

ipcMain.handle('settings:update', async (_event: Electron.IpcMainInvokeEvent, { key, value }: UpdateSettingsRequest) => {
  try {
    (store as any).set(`settings.${key}`, value);
    const updatedSettings = (store as any).get('settings');

    // Handle theme changes
    if (key === 'theme') {
      for (const win of windows) {
        win.setBackgroundColor(nativeTheme.shouldUseDarkColors ? '#121416' : '#ffffff');
      }
    }

    return { success: true, settings: updatedSettings };
  } catch (err) {
    console.error('Failed to update settings:', err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});

ipcMain.handle('settings:reset', async () => {
  try {
    (store as any).reset('settings');
    const settings = (store as any).get('settings');
    return { success: true, settings };
  } catch (err) {
    console.error('Failed to reset settings:', err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});

// Handle download directory selection
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
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});
