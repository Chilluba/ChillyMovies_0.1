import { contextBridge, ipcRenderer } from "electron";
const api = {
  downloadManager: {
    start: async (request) => {
      return await ipcRenderer.invoke("download:start", request);
    },
    getAll: async () => {
      return await ipcRenderer.invoke("download:getAll");
    },
    pause: async (id) => {
      await ipcRenderer.invoke("download:pause", id);
    },
    resume: async (id) => {
      await ipcRenderer.invoke("download:resume", id);
    },
    cancel: async (id) => {
      await ipcRenderer.invoke("download:cancel", id);
    },
    selectDirectory: async () => {
      const result = await ipcRenderer.invoke("download:selectDirectory");
      return result;
    }
  },
  settings: {
    get: async () => {
      return await ipcRenderer.invoke("settings:get");
    },
    update: async (request) => {
      return await ipcRenderer.invoke("settings:update", request);
    },
    reset: async () => {
      return await ipcRenderer.invoke("settings:reset");
    }
  }
};
contextBridge.exposeInMainWorld("electron", api);
