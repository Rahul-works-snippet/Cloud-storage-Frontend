'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface SearchResultItemProps {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  owner: string;
  path: string;
  thumbnail?: string;
  isShared: boolean;
  onShare: (id: string, name: string) => void;
  onDownload: (id: string, name: string) => void;
  onPreview: (id: string, name: string) => void;
}

const SearchResultItem = ({
  id,
  name,
  type,
  size,
  modified,
  owner,
  path,
  thumbnail,
  isShared,
  onShare,
  onDownload,
  onPreview,
}: SearchResultItemProps) => {
  const [showActions, setShowActions] = useState(false);

  const getFileIcon = (fileType: string) => {
    const iconMap: Record<string, string> = {
      document: 'DocumentTextIcon',
      image: 'PhotoIcon',
      video: 'VideoCameraIcon',
      audio: 'MusicalNoteIcon',
      pdf: 'DocumentIcon',
      spreadsheet: 'TableCellsIcon',
      folder: 'FolderIcon',
    };
    return iconMap[fileType] || 'DocumentIcon';
  };

  const pathSegments = path.split('/').filter(Boolean);

  return (
    <div
      className="group relative bg-card border border-border rounded-lg p-4 hover:shadow-brand-lg transition-smooth"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-4">
        {/* Thumbnail/Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
          {thumbnail ? (
            <AppImage
              src={thumbnail}
              alt={`Thumbnail preview of ${name} file`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon name={getFileIcon(type) as any} size={24} className="text-muted-foreground" />
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground truncate mb-1">{name}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="caption text-muted-foreground">{type}</span>
                <span className="caption text-muted-foreground">•</span>
                <span className="caption text-muted-foreground">{size}</span>
                <span className="caption text-muted-foreground">•</span>
                <span className="caption text-muted-foreground">{modified}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className={`flex items-center gap-1 transition-smooth ${
                showActions ? 'opacity-100' : 'opacity-0 lg:opacity-100'
              }`}
            >
              <button
                onClick={() => onPreview(id, name)}
                className="p-1.5 rounded-md hover:bg-muted transition-smooth"
                aria-label="Preview file"
              >
                <Icon name="EyeIcon" size={18} className="text-muted-foreground" />
              </button>
              <button
                onClick={() => onShare(id, name)}
                className="p-1.5 rounded-md hover:bg-muted transition-smooth"
                aria-label="Share file"
              >
                <Icon name="ShareIcon" size={18} className="text-muted-foreground" />
              </button>
              <button
                onClick={() => onDownload(id, name)}
                className="p-1.5 rounded-md hover:bg-muted transition-smooth"
                aria-label="Download file"
              >
                <Icon name="ArrowDownTrayIcon" size={18} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Path Breadcrumb */}
          <div className="flex items-center gap-1 flex-wrap mb-2">
            <Icon name="FolderIcon" size={14} className="text-muted-foreground flex-shrink-0" />
            {pathSegments.map((segment, index) => (
              <div key={index} className="flex items-center gap-1">
                <Link
                  href={`/main-dashboard?path=${pathSegments.slice(0, index + 1).join('/')}`}
                  className="caption text-primary hover:underline truncate max-w-[120px]"
                >
                  {segment}
                </Link>
                {index < pathSegments.length - 1 && (
                  <Icon name="ChevronRightIcon" size={12} className="text-muted-foreground flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Icon name="UserIcon" size={14} className="text-muted-foreground" />
              <span className="caption text-muted-foreground">{owner}</span>
            </div>
            {isShared && (
              <div className="flex items-center gap-1">
                <Icon name="UserGroupIcon" size={14} className="text-primary" />
                <span className="caption text-primary">Shared</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultItem;