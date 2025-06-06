import { ipcMain, dialog, app } from 'electron'
import WebTorrent from 'webtorrent'
import { promises as fs } from 'fs'
import path from 'path'
import * as youtubeDL from 'youtube-dl-exec'
import type { Download, DownloadRequest } from '../src/types/electron'
import type { VideoQuality } from '../src/types/api'

class DownloadManager {
  private client: WebTorrent.Instance
  private downloads: Map<string, Download> = new Map()
  private defaultDownloadPath: string
  private activeDownloads: Map<string, { cancel: () => void }> = new Map()

  constructor() {
    this.client = new WebTorrent()
    this.defaultDownloadPath = app.getPath('downloads')
    this.setupIPCHandlers()

    // Clean up torrent client when app closes
    app.on('before-quit', () => {
      this.client.destroy()
    })
  }

  private setupIPCHandlers() {
    ipcMain.handle('download:start', async (_event, request: DownloadRequest) => {
      try {
        const savePath = await this.getSavePath(request)
        if (!savePath) return { success: false, error: 'Download cancelled' }

        const downloadId = `${request.type}-${request.contentId}-${Date.now()}`
        
        this.downloads.set(downloadId, {
          id: downloadId,
          progress: 0,
          speed: '0 KB/s',
          eta: 'Unknown',
          status: 'queued'
        })

        if (request.url?.startsWith('magnet:') || request.url?.endsWith('.torrent')) {
          // Handle torrent download
          this.client.add(request.url, { path: savePath }, (torrent) => {
            const download = this.downloads.get(downloadId)
            if (!download) return

            torrent.on('download', () => {
              download.progress = torrent.progress * 100
              download.speed = this.formatBytes(torrent.downloadSpeed) + '/s'
              download.eta = this.formatTime(torrent.timeRemaining)
              this.downloads.set(downloadId, download)
            })

            torrent.on('done', () => {
              download.progress = 100
              download.status = 'completed'
              download.speed = '0 KB/s'
              download.eta = 'Completed'
              this.downloads.set(downloadId, download)
              
              // Clean up the torrent
              torrent.destroy()
            })

            torrent.on('error', (err) => {
              download.status = 'error'
              download.error = err instanceof Error ? err.message : String(err)
              this.downloads.set(downloadId, download)
            })
          })
        } else if (request.type === 'youtube' && request.url) {
          this.handleYouTubeDownload(
            downloadId,
            request.url,
            savePath,
            request.quality,
            request.audioOnly
          )
        } else {
          // TODO: Implement direct download logic
          this.simulateProgress(downloadId)
        }

        return { success: true, downloadId }
      } catch (err) {
        console.error('Download error:', err)
        return {
          success: false,
          error: err instanceof Error ? err.message : String(err)
        }
      }
    })

    ipcMain.handle('download:pause', (_event, downloadId: string) => {
      const download = this.downloads.get(downloadId)
      if (download) {
        download.status = 'paused'
        this.downloads.set(downloadId, download)
      }
    })

    ipcMain.handle('download:resume', (_event, downloadId: string) => {
      const download = this.downloads.get(downloadId)
      if (download) {
        download.status = 'downloading'
        this.downloads.set(downloadId, download)
      }
    })

    ipcMain.handle('download:cancel', async (_event, downloadId: string) => {
      const activeDownload = this.activeDownloads.get(downloadId)
      if (activeDownload) {
        activeDownload.cancel()
      }
      this.downloads.delete(downloadId)
      this.activeDownloads.delete(downloadId)
    })

    ipcMain.handle('download:getAll', () => {
      return Array.from(this.downloads.values())
    })
  }

  private async getSavePath(request: DownloadRequest): Promise<string | undefined> {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Download',
      defaultPath: `~/Downloads/${request.contentId}`,
      buttonLabel: 'Download',
      properties: ['createDirectory']
    })
    
    return filePath
  }

  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  private formatTime(ms: number): string {
    if (!ms || ms === Infinity) return 'Unknown'

    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  private simulateProgress(downloadId: string) {
    let progress = 0
    const interval = setInterval(() => {
      const download = this.downloads.get(downloadId)
      if (!download || download.status === 'paused') return

      progress += Math.random() * 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        download.status = 'completed'
      }

      download.progress = Math.min(progress, 100)
      download.speed = `${Math.floor(Math.random() * 10)} MB/s`
      download.eta = `${Math.floor((100 - progress) / 10)} seconds`
      
      this.downloads.set(downloadId, download)
    }, 1000)
  }

  private async handleYouTubeDownload(
    downloadId: string,
    url: string,
    savePath: string,
    quality: VideoQuality,
    audioOnly: boolean = false
  ) {
    const download = this.downloads.get(downloadId)
    if (!download) return

    try {
      download.status = 'downloading'
      this.downloads.set(downloadId, download)

      const options: any = {
        output: savePath,
        format: audioOnly ? 'bestaudio' : `bestvideo[height<=${quality.height}]+bestaudio/best[height<=${quality.height}]`
      }

      if (audioOnly) {
        options.extractAudio = true
        options.audioFormat = 'mp3'
      }

      const controller = new AbortController()
      this.activeDownloads.set(downloadId, { cancel: () => controller.abort() })

      const ytProcess = await youtubeDL.default(url, {
        ...options,
        signal: controller.signal
      })

      // Update progress based on file size
      const updateProgress = async () => {
        try {
          const stats = await fs.stat(savePath)
          const fileSize = stats.size
          
          download.progress = Math.min((fileSize / 1024 / 1024) * 5, 100) // Estimate progress
          download.speed = '...'
          download.eta = 'Calculating...'
          this.downloads.set(downloadId, { ...download })
          
          if (download.status === 'downloading' && download.progress < 100) {
            setTimeout(updateProgress, 1000)
          }
        } catch (err) {
          // File might not exist yet
        }
      }

      updateProgress()

      await ytProcess

      download.progress = 100
      download.status = 'completed'
      download.speed = '0 B/s'
      download.eta = 'Completed'
      this.downloads.set(downloadId, download)

    } catch (err) {
      console.error('YouTube download error:', err)
      download.status = 'error'
      download.error = err instanceof Error ? err.message : String(err)
      this.downloads.set(downloadId, download)
    } finally {
      this.activeDownloads.delete(downloadId)
    }
  }
}

export default DownloadManager;

module.exports = { DownloadManager };
