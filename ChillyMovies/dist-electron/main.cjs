var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_main = __commonJS({
  "main.cjs"() {
    const { app, BrowserWindow, ipcMain, dialog, nativeTheme } = require("electron");
    const path = require("path");
    const { store } = require("./store");
    const { DownloadManager } = require("./downloadManager");
    new DownloadManager();
    const windows = /* @__PURE__ */ new Set();
    function createWindow() {
      const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.join(__dirname, "preload.cjs")
        },
        backgroundColor: nativeTheme.shouldUseDarkColors ? "#121416" : "#ffffff"
      });
      windows.add(win);
      win.on("closed", () => windows.delete(win));
      {
        win.loadURL("http://localhost:5173");
        win.webContents.openDevTools();
      }
    }
    app.whenReady().then(() => {
      createWindow();
      app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
        }
      });
    });
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
    ipcMain.handle("settings:get", async () => {
      try {
        const settings = store.get("settings");
        return { success: true, settings };
      } catch (err) {
        console.error("Failed to get settings:", err);
        return { success: false, error: err instanceof Error ? err.message : String(err) };
      }
    });
    ipcMain.handle("settings:update", async (_event, { key, value }) => {
      try {
        const settings = store.get("settings");
        const updatedSettings = { ...settings, [key]: value };
        store.set("settings", updatedSettings);
        if (key === "theme") {
          for (const win of windows) {
            win.setBackgroundColor(nativeTheme.shouldUseDarkColors ? "#121416" : "#ffffff");
          }
        }
        return { success: true, settings: updatedSettings };
      } catch (err) {
        console.error("Failed to update settings:", err);
        return { success: false, error: err instanceof Error ? err.message : String(err) };
      }
    });
    ipcMain.handle("settings:reset", async () => {
      try {
        store.clear();
        const settings = store.get("settings");
        return { success: true, settings };
      } catch (err) {
        console.error("Failed to reset settings:", err);
        return { success: false, error: err instanceof Error ? err.message : String(err) };
      }
    });
    ipcMain.handle("download:selectDirectory", async () => {
      try {
        const { canceled, filePaths } = await dialog.showOpenDialog({
          properties: ["openDirectory", "createDirectory"],
          title: "Select Download Location",
          buttonLabel: "Select Folder"
        });
        if (canceled || filePaths.length === 0) {
          return { success: false };
        }
        return { success: true, path: filePaths[0] };
      } catch (err) {
        console.error("Failed to select directory:", err);
        return { success: false, error: err instanceof Error ? err.message : String(err) };
      }
    });
  }
});
export default require_main();
