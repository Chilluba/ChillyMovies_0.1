import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from '../src/types/electron';

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

const api: ElectronAPI = {
  downloadManager: {
    start: (request) => ipcRenderer.invoke('download:start', request),
    getAll: () => ipcRenderer.invoke('download:getAll'),
    pause: (id) => ipcRenderer.invoke('download:pause', id),
    resume: (id) => ipcRenderer.invoke('download:resume', id),
    cancel: (id) => ipcRenderer.invoke('download:cancel', id),
    selectDirectory: () => ipcRenderer.invoke('download:selectDirectory'),
  },
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    update: (request) => ipcRenderer.invoke('settings:update', request),
    reset: () => ipcRenderer.invoke('settings:reset'),
  },
  receive: (channel, func) => {
    const validChannels = ['download:progress', 'download:cancel', 'download:error'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      const subscription = (event: Electron.IpcRendererEvent, ...args: any[]) => func(...args);
      ipcRenderer.on(channel, subscription);
      
      // Return a cleanup function
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    }
  },
};

contextBridge.exposeInMainWorld('electron', api);
