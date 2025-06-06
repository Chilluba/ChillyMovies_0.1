import { contextBridge as a, ipcRenderer as t } from "electron";
const n = {
  downloadManager: {
    start: async (e) => await t.invoke("download:start", e),
    getAll: async () => await t.invoke("download:getAll"),
    pause: async (e) => {
      await t.invoke("download:pause", e);
    },
    resume: async (e) => {
      await t.invoke("download:resume", e);
    },
    cancel: async (e) => {
      await t.invoke("download:cancel", e);
    },
    selectDirectory: async () => await t.invoke("download:selectDirectory")
  },
  settings: {
    get: async () => await t.invoke("settings:get"),
    update: async (e) => await t.invoke("settings:update", e),
    reset: async () => await t.invoke("settings:reset")
  }
};
a.exposeInMainWorld("electron", n);
