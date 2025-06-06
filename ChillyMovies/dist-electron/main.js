const { app: n, BrowserWindow: d, ipcMain: o, dialog: h, nativeTheme: g } = require("electron"), a = require("path"), { store: r } = require("./store"), { DownloadManager: w } = require("./downloadManager");
new w();
const c = /* @__PURE__ */ new Set();
function l() {
  const e = new d({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: a.join(__dirname, "preload.js")
    },
    backgroundColor: g.shouldUseDarkColors ? "#121416" : "#ffffff"
  });
  c.add(e), e.on("closed", () => c.delete(e)), process.env.NODE_ENV === "development" ? (e.loadURL("http://localhost:5173"), e.webContents.openDevTools()) : e.loadFile(a.join(__dirname, "../dist/index.html"));
}
n.whenReady().then(() => {
  l(), n.on("activate", () => {
    d.getAllWindows().length === 0 && l();
  });
});
n.on("window-all-closed", () => {
  process.platform !== "darwin" && n.quit();
});
o.handle("settings:get", async () => {
  try {
    return { success: !0, settings: r.get("settings") };
  } catch (e) {
    return console.error("Failed to get settings:", e), { success: !1, error: e instanceof Error ? e.message : String(e) };
  }
});
o.handle("settings:update", async (e, { key: t, value: u }) => {
  try {
    const i = { ...r.get("settings"), [t]: u };
    if (r.set("settings", i), t === "theme")
      for (const f of c)
        f.setBackgroundColor(g.shouldUseDarkColors ? "#121416" : "#ffffff");
    return { success: !0, settings: i };
  } catch (s) {
    return console.error("Failed to update settings:", s), { success: !1, error: s instanceof Error ? s.message : String(s) };
  }
});
o.handle("settings:reset", async () => {
  try {
    return r.clear(), { success: !0, settings: r.get("settings") };
  } catch (e) {
    return console.error("Failed to reset settings:", e), { success: !1, error: e instanceof Error ? e.message : String(e) };
  }
});
o.handle("download:selectDirectory", async () => {
  try {
    const { canceled: e, filePaths: t } = await h.showOpenDialog({
      properties: ["openDirectory", "createDirectory"],
      title: "Select Download Location",
      buttonLabel: "Select Folder"
    });
    return e || t.length === 0 ? { success: !1 } : { success: !0, path: t[0] };
  } catch (e) {
    return console.error("Failed to select directory:", e), { success: !1, error: e instanceof Error ? e.message : String(e) };
  }
});
