'use client';

import Icon from '@/components/ui/AppIcon';

interface UploadItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface UploadProgressProps {
  uploads: UploadItem[];
  onCancel: (id: string) => void;
  onDismiss: (id: string) => void;
}

const UploadProgress = ({ uploads, onCancel, onDismiss }: UploadProgressProps) => {
  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-card border border-border rounded-lg shadow-brand-2xl overflow-hidden z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
        <h3 className="text-sm font-medium text-foreground">
          Uploading {uploads.filter((u) => u.status === 'uploading').length} file(s)
        </h3>
        <button
          onClick={() => uploads.forEach((u) => onDismiss(u.id))}
          className="p-1 rounded-md hover:bg-background transition-smooth"
          aria-label="Dismiss all"
        >
          <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {uploads.map((upload) => (
          <div key={upload.id} className="px-4 py-3 border-b border-border last:border-b-0">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                {upload.status === 'uploading' && (
                  <Icon name="DocumentIcon" size={20} className="text-muted-foreground" />
                )}
                {upload.status === 'completed' && (
                  <Icon name="CheckCircleIcon" size={20} className="text-success" />
                )}
                {upload.status === 'error' && (
                  <Icon name="ExclamationCircleIcon" size={20} className="text-destructive" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate" title={upload.name}>
                  {upload.name}
                </p>
                <p className="caption text-muted-foreground mt-0.5">{upload.size}</p>

                {upload.status === 'uploading' && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="caption text-muted-foreground">{upload.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-smooth"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {upload.status === 'completed' && (
                  <p className="caption text-success mt-1">Upload complete</p>
                )}

                {upload.status === 'error' && (
                  <p className="caption text-destructive mt-1">Upload failed</p>
                )}
              </div>

              <button
                onClick={() =>
                  upload.status === 'uploading' ? onCancel(upload.id) : onDismiss(upload.id)
                }
                className="flex-shrink-0 p-1 rounded-md hover:bg-muted transition-smooth"
                aria-label={upload.status === 'uploading' ? 'Cancel upload' : 'Dismiss'}
              >
                <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadProgress;