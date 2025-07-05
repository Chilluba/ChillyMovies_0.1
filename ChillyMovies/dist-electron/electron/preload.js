"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { contextBridge, ipcRenderer } = require('electron');
const api = {
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
            const subscription = (event, ...args) => func(...args);
            ipcRenderer.on(channel, subscription);
            // Return a cleanup function
            return () => {
                ipcRenderer.removeListener(channel, subscription);
            };
        }
    },
};
contextBridge.exposeInMainWorld('electron', api);
