'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface DetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    id: string;
    name: string;
    type: 'file' | 'folder';
    size?: string;
    owner: string;
    createdDate: string;
    modifiedDate: string;
    thumbnail?: string;
    isShared: boolean;
    sharedWith: Array<{ name: string; email: string; permission: string }>;
    activity: Array<{ action: string; user: string; timestamp: string }>;
  } | null;
}

const DetailsPanel = ({ isOpen, onClose, file }: DetailsPanelProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !file) return null;

  const getFileIcon = () => {
    if (file.type === 'folder') return 'FolderIcon';
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'DocumentTextIcon';
      case 'doc': case'docx':
        return 'DocumentIcon';
      case 'jpg': case'jpeg': case'png':
        return 'PhotoIcon';
      default:
        return 'DocumentIcon';
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="lg:hidden fixed inset-0 bg-background z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`
          fixed top-0 right-0 h-screen w-full sm:w-96 bg-card border-l border-border z-50
          transition-smooth shadow-brand-2xl overflow-hidden flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-heading font-semibold text-foreground">Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-smooth"
            aria-label="Close details panel"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Preview */}
          <div className="p-6 border-b border-border">
            <div className="aspect-video rounded-lg bg-muted overflow-hidden mb-4">
              {file.type === 'folder' || !file.thumbnail || imageError ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon
                    name={getFileIcon() as any}
                    size={64}
                    className={file.type === 'folder' ? 'text-primary' : 'text-muted-foreground'}
                  />
                </div>
              ) : (
                <AppImage
                  src={file.thumbnail}
                  alt={`Preview of ${file.name}`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <h3 className="text-base font-medium text-foreground truncate" title={file.name}>
              {file.name}
            </h3>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('details')}
              className={`
                flex-1 px-6 py-3 text-sm font-medium transition-smooth
                ${
                  activeTab === 'details' ?'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`
                flex-1 px-6 py-3 text-sm font-medium transition-smooth
                ${
                  activeTab === 'activity' ?'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              Activity
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* File Info */}
                <div className="space-y-3">
                  <div>
                    <p className="caption text-muted-foreground mb-1">Type</p>
                    <p className="text-sm text-foreground capitalize">{file.type}</p>
                  </div>
                  {file.size && (
                    <div>
                      <p className="caption text-muted-foreground mb-1">Size</p>
                      <p className="text-sm text-foreground">{file.size}</p>
                    </div>
                  )}
                  <div>
                    <p className="caption text-muted-foreground mb-1">Owner</p>
                    <p className="text-sm text-foreground">{file.owner}</p>
                  </div>
                  <div>
                    <p className="caption text-muted-foreground mb-1">Created</p>
                    <p className="text-sm text-foreground">{file.createdDate}</p>
                  </div>
                  <div>
                    <p className="caption text-muted-foreground mb-1">Modified</p>
                    <p className="text-sm text-foreground">{file.modifiedDate}</p>
                  </div>
                </div>

                {/* Sharing Info */}
                {file.isShared && file.sharedWith.length > 0 && (
                  <div>
                    <p className="caption text-muted-foreground mb-3">Shared with</p>
                    <ul className="space-y-2">
                      {file.sharedWith.map((user, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate">{user.name}</p>
                            <p className="caption text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <span className="caption text-muted-foreground flex-shrink-0">
                            {user.permission}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                {file.activity.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Icon name="ClockIcon" size={16} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{item.action}</p>
                      <p className="caption text-muted-foreground mt-0.5">
                        {item.user} • {item.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default DetailsPanel;