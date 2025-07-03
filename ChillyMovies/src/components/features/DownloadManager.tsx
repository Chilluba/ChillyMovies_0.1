import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import type { Download } from '../../types/electron';

export const DownloadManager = () => {
  const [downloads, setDownloads] = useState<Download[]>([]);

  const handleUpdate = (updatedDownload: Download) => {
    setDownloads((prev) => {
      const index = prev.findIndex((d) => d.id === updatedDownload.id);
      if (index > -1) {
        const newDownloads = [...prev];
        newDownloads[index] = updatedDownload;
        return newDownloads;
      } else {
        return [...prev, updatedDownload];
      }
    });
  };

  const handleCancel = (downloadId: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== downloadId));
  };

  const handleError = ({ downloadId, error }: { downloadId: string; error: string }) => {
    setDownloads((prev) =>
      prev.map((d) => (d.id === downloadId ? { ...d, status: 'error', error } : d))
    );
  };

  useEffect(() => {
    const unlistenProgress = window.electron.receive('download:progress', handleUpdate);
    const unlistenCancel = window.electron.receive('download:cancel', handleCancel);
    const unlistenError = window.electron.receive('download:error', handleError);

    window.electron.downloadManager.getAll().then(setDownloads);

    return () => {
      unlistenProgress?.();
      unlistenCancel?.();
      unlistenError?.();
    };
  }, []);

  const clearCompleted = () => {
    setDownloads(downloads.filter((d) => d.status !== 'completed'));
  };

  if (downloads.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 w-96 overflow-hidden rounded-xl bg-background shadow-lg">
      <div className="flex items-center justify-between border-b border-secondary bg-primary p-4">
        <h3 className="font-medium text-white">Downloads</h3>
        <Button variant="ghost" size="sm" onClick={clearCompleted}>
          Clear Completed
        </Button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {downloads.map((download) => (
            <div key={download.id} className="rounded-lg border border-secondary bg-primary p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="truncate text-sm text-white" title={download.name}>
                  {download.status === 'completed' ? '✓ ' : ''}
                  {download.name}
                </span>
                {download.status === 'downloading' && (
                  <span className="text-sm text-text-secondary">
                    {download.speed} • {download.eta}
                  </span>
                )}
              </div>
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${download.progress}%` }}
                />
              </div>
              <div className="flex gap-2">
                {download.status === 'downloading' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.electron.downloadManager.pause(download.id)}
                  >
                    Pause
                  </Button>
                )}
                {download.status === 'paused' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.electron.downloadManager.resume(download.id)}
                  >
                    Resume
                  </Button>
                )}
                {download.status !== 'completed' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => window.electron.downloadManager.cancel(download.id)}
                  >
                    Cancel
                  </Button>
                )}
                {download.status === 'completed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDownloads(downloads.filter((d) => d.id !== download.id))}
                  >
                    Clear
                  </Button>
                )}
              </div>
              {download.error && (
                <p className="mt-2 text-sm text-red-500">{download.error}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
