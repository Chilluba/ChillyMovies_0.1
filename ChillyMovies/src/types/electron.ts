import type { VideoQuality } from './api';

export interface DownloadRequest {
  contentId: string | number;
  name?: string;
  quality: VideoQuality;
  type: 'movie' | 'tv' | 'youtube';
  magnet: string;
  audioOnly?: boolean;
}

export interface Download {
  id: string;
  name: string;
  type: 'movie' | 'tv' | 'youtube';
  progress: number;
  speed: string;
  eta: string;
  status: 'queued' | 'downloading' | 'paused' | 'completed' | 'error' | 'canceled';
  error?: string;
}

import type { UpdateSettingsRequest, SettingsResponse } from './settings';

export interface ElectronAPI {
  downloadManager: {
    start: (request: DownloadRequest) => Promise<{
      success: boolean;
      error?: string;
      downloadId?: string;
    }>;
    getAll: () => Promise<Download[]>;
    pause: (id: string) => Promise<void>;
    resume: (id: string) => Promise<void>;
    cancel: (id: string) => Promise<void>;
    selectDirectory: () => Promise<{
      success: boolean;
      path?: string;
      error?: string;
    }>;
  };
  settings: {
    get: () => Promise<SettingsResponse>;
    update: (request: UpdateSettingsRequest) => Promise<SettingsResponse>;
    reset: () => Promise<SettingsResponse>;
  };
  receive: (channel: string, func: (...args: any[]) => void) => (() => void) | undefined;
}
