const { ipcMain, dialog, app, BrowserWindow } = require('electron');
const WebTorrent = require('webtorrent');
const path = require('path');
const youtubeDL = require('youtube-dl-exec');
import type { Download, DownloadRequest } from '../src/types/electron';
const store = require('./store');
import type { Settings } from '../src/types/settings';

// Define a type for our active downloads, which can be a torrent or a YouTube process
type ActiveDownload =
  | { type: 'torrent'; torrent: WebTorrent.Torrent }
  | { type: 'youtube'; process: ReturnType<typeof youtubeDL.exec> };

class DownloadManager {
  private client: WebTorrent.Instance;
  private downloads: Map<string, Download> = new Map();
  private activeDownloads: Map<string, ActiveDownload> = new Map();

  constructor() {
    this.client = new WebTorrent();
    this.setupIPCHandlers();

    app.on('before-quit', () => {
      this.client.destroy();
    });
  }

  private sendToAllWindows(channel: string, ...args: any[]) {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send(channel, ...args);
    });
  }

  private setupIPCHandlers() {
    ipcMain.handle('download:start', async (_event, request: DownloadRequest) => {
      try {
        return await this.startDownload(request);
      } catch (err) {
        console.error('Download error:', err);
        const error = err instanceof Error ? err.message : String(err);
        this.sendToAllWindows('download:error', { downloadId: request.contentId, error });
        return { success: false, error };
      }
    });

    ipcMain.handle('download:pause', (_event, downloadId: string) => {
      this.pauseDownload(downloadId);
    });

    ipcMain.handle('download:resume', (_event, downloadId: string) => {
      this.resumeDownload(downloadId);
    });

    ipcMain.handle('download:cancel', async (_event, downloadId: string) => {
      this.cancelDownload(downloadId);
    });

    ipcMain.handle('download:getAll', () => {
      return Array.from(this.downloads.values());
    });
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B/s';
    const units = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  }

  private formatTime(ms: number): string {
    if (!ms || ms === Infinity) return 'Unknown';
    return new Date(ms).toISOString().substr(11, 8);
  }

  private async startDownload(request: DownloadRequest) {
    const downloadId = String(request.contentId);
    const settings = (store as any).get('settings') as Settings;
    const savePath = settings.downloadPath || app.getPath('downloads');

    const newDownload: Download = {
      id: downloadId,
      name: request.name || downloadId,
      type: request.type,
      progress: 0,
      speed: '0 B/s',
      eta: 'Unknown',
      status: 'queued',
    };
    this.downloads.set(downloadId, newDownload);
    this.sendToAllWindows('download:progress', newDownload);

    if (request.type === 'youtube') {
      this.startYouTubeDownload(request, newDownload, savePath);
    } else {
      this.startTorrentDownload(request, newDownload, savePath);
    }

    return { success: true, downloadId };
  }

  private startYouTubeDownload(request: DownloadRequest, download: Download, savePath: string) {
    const downloadId = String(download.id);
    const videoUrl = request.magnet; // Using magnet field for URL
    const filePath = path.join(savePath, `%(title)s-%(id)s.%(ext)s`);

    let format = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
    if (request.audioOnly) {
      format = 'bestaudio[ext=m4a]';
    } else if (request.quality && request.quality.width && request.quality.height) {
      format = `bestvideo[width<=${request.quality.width}][height<=${request.quality.height}][ext=mp4]+bestaudio[ext=m4a]/best[width<=${request.quality.width}][height<=${request.quality.height}][ext=mp4]/best`;
    }

    const youtubeProcess = youtubeDL.exec(videoUrl, {
      output: filePath,
      format,
      noWarnings: true,
      noCheckCertificates: true,
      youtubeSkipDashManifest: true,
    });

    this.activeDownloads.set(downloadId, { type: 'youtube', process: youtubeProcess });
    download.status = 'downloading';
    this.sendToAllWindows('download:progress', download);

    youtubeProcess.stdout?.on('data', (data: Buffer) => {
      const output = data.toString();
      const progressMatch = output.match(/\[download\]\s+([\d.]+)% of/);
      const speedMatch = output.match(/at\s+([~\d.NA/s]+)/);
      const etaMatch = output.match(/ETA\s+([\d:]+)/);

      if (progressMatch) download.progress = parseFloat(progressMatch[1]);
      if (speedMatch) download.speed = speedMatch[1].replace('~','');
      if (etaMatch) download.eta = etaMatch[1];
      
      this.sendToAllWindows('download:progress', download);
    });

    youtubeProcess.then(() => {
      download.status = 'completed';
      download.progress = 100;
      this.activeDownloads.delete(downloadId);
      this.sendToAllWindows('download:progress', download);
    }).catch((err) => {
      if (err.killed) {
        download.status = 'canceled';
      } else {
        download.status = 'error';
        download.error = err.message;
      }
      this.activeDownloads.delete(downloadId);
      this.sendToAllWindows('download:progress', download);
    });
  }

  private startTorrentDownload(request: DownloadRequest, download: Download, savePath: string) {
    const downloadId = String(download.id);

    if (!request.magnet) {
      download.status = 'error';
      download.error = 'No magnet link provided.';
      this.sendToAllWindows('download:progress', download);
      return;
    }

    this.client.add(request.magnet, { path: savePath }, (torrent) => {
      this.activeDownloads.set(downloadId, { type: 'torrent', torrent });
      download.name = torrent.name; // Update name from torrent metadata
      download.status = 'downloading';
      this.sendToAllWindows('download:progress', download);

      torrent.on('download', () => {
        download.progress = Math.round(torrent.progress * 100);
        download.speed = this.formatBytes(torrent.downloadSpeed);
        download.eta = this.formatTime(torrent.timeRemaining);
        this.sendToAllWindows('download:progress', download);
      });

      torrent.on('done', () => {
        download.status = 'completed';
        download.progress = 100;
        this.activeDownloads.delete(downloadId);
        this.sendToAllWindows('download:progress', download);
      });

      torrent.on('error', (err) => {
        download.status = 'error';
        download.error = typeof err === 'string' ? err : err.message;
        this.activeDownloads.delete(downloadId);
        this.sendToAllWindows('download:progress', download);
      });
    });
  }

  private pauseDownload(downloadId: string) {
    const download = this.downloads.get(downloadId);
    const activeDownload = this.activeDownloads.get(downloadId);

    if (download && activeDownload?.type === 'youtube') {
      activeDownload.process.kill('SIGSTOP');
      download.status = 'paused';
      this.sendToAllWindows('download:progress', download);
    } else {
      console.warn(`Pausing is not supported for this download type.`);
    }
  }

  private resumeDownload(downloadId: string) {
    const download = this.downloads.get(downloadId);
    const activeDownload = this.activeDownloads.get(downloadId);

    if (download && activeDownload?.type === 'youtube') {
      activeDownload.process.kill('SIGCONT');
      download.status = 'downloading';
      this.sendToAllWindows('download:progress', download);
    } else {
      console.warn(`Resuming is not supported for this download type.`);
    }
  }

  private cancelDownload(downloadId: string) {
    const activeDownload = this.activeDownloads.get(downloadId);
    if (activeDownload) {
      if (activeDownload.type === 'torrent') {
        activeDownload.torrent.destroy();
      } else {
        activeDownload.process.kill();
      }
    }
    this.downloads.delete(downloadId);
    this.activeDownloads.delete(downloadId);
    this.sendToAllWindows('download:cancel', downloadId);
  }
}

module.exports = DownloadManager;
