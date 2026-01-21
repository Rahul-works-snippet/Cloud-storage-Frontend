'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface FileItemProps {
  file: {
    id: string;
    name: string;
    type: 'file' | 'folder';
    size?: string;
    modifiedDate: string;
    thumbnail?: string;
    isShared: boolean;
    isStarred: boolean;
    owner: string;
  };
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, fileId: string) => void;
  onDoubleClick: (fileId: string) => void;
  onStarToggle: (fileId: string) => void;
}

const FileItem = ({
  file,
  viewMode,
  isSelected,
  onSelect,
  onContextMenu,
  onDoubleClick,
  onStarToggle,
}: FileItemProps) => {
  const [imageError, setImageError] = useState(false);

  const getFileIcon = () => {
    if (file.type === 'folder') return 'FolderIcon';
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'DocumentTextIcon';
      case 'doc': case'docx':
        return 'DocumentIcon';
      case 'xls': case'xlsx':
        return 'TableCellsIcon';
      case 'jpg': case'jpeg': case'png': case'gif':
        return 'PhotoIcon';
      case 'mp4': case'mov':
        return 'VideoCameraIcon';
      case 'mp3': case'wav':
        return 'MusicalNoteIcon';
      default:
        return 'DocumentIcon';
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(e, file.id);
  };

  if (viewMode === 'grid') {
    return (
      <div
        className={`
          group relative rounded-lg border transition-smooth cursor-pointer
          ${
            isSelected
              ? 'border-primary bg-primary/5 shadow-brand'
              : 'border-border bg-card hover:border-primary/50 hover:shadow-brand'
          }
        `}
        onClick={() => onSelect(file.id)}
        onContextMenu={handleContextMenu}
        onDoubleClick={() => onDoubleClick(file.id)}
      >
        <div className="p-4">
          {/* Thumbnail/Icon */}
          <div className="relative aspect-square rounded-md bg-muted overflow-hidden mb-3">
            {file.type === 'folder' || !file.thumbnail || imageError ? (
              <div className="w-full h-full flex items-center justify-center">
                <Icon
                  name={getFileIcon() as any}
                  size={48}
                  className={file.type === 'folder' ? 'text-primary' : 'text-muted-foreground'}
                />
              </div>
            ) : (
              <AppImage
                src={file.thumbnail}
                alt={`Thumbnail preview of ${file.name}`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            )}
            {/* Star Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStarToggle(file.id);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-smooth hover:bg-card"
              aria-label={file.isStarred ? 'Remove from starred' : 'Add to starred'}
            >
              <Icon
                name="StarIcon"
                size={16}
                variant={file.isStarred ? 'solid' : 'outline'}
                className={file.isStarred ? 'text-accent' : 'text-muted-foreground'}
              />
            </button>
          </div>

          {/* File Info */}
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <h3 className="flex-1 text-sm font-medium text-foreground truncate" title={file.name}>
                {file.name}
              </h3>
              {file.isShared && (
                <Icon name="UserGroupIcon" size={14} className="text-muted-foreground flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 caption text-muted-foreground">
              <span>{file.modifiedDate}</span>
              {file.size && (
                <>
                  <span>•</span>
                  <span>{file.size}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Selection Checkbox */}
        <div
          className={`
            absolute top-3 left-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-smooth
            ${
              isSelected
                ? 'bg-primary border-primary' :'bg-card border-border opacity-0 group-hover:opacity-100'
            }
          `}
        >
          {isSelected && <Icon name="CheckIcon" size={14} className="text-primary-foreground" />}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div
      className={`
        group flex items-center gap-4 px-4 py-3 rounded-lg border transition-smooth cursor-pointer
        ${
          isSelected
            ? 'border-primary bg-primary/5 shadow-brand'
            : 'border-border bg-card hover:border-primary/50 hover:shadow-brand'
        }
      `}
      onClick={() => onSelect(file.id)}
      onContextMenu={handleContextMenu}
      onDoubleClick={() => onDoubleClick(file.id)}
    >
      {/* Selection Checkbox */}
      <div
        className={`
          w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-smooth
          ${
            isSelected
              ? 'bg-primary border-primary' :'bg-card border-border opacity-0 group-hover:opacity-100'
          }
        `}
      >
        {isSelected && <Icon name="CheckIcon" size={14} className="text-primary-foreground" />}
      </div>

      {/* Icon/Thumbnail */}
      <div className="w-10 h-10 rounded-md bg-muted overflow-hidden flex-shrink-0">
        {file.type === 'folder' || !file.thumbnail || imageError ? (
          <div className="w-full h-full flex items-center justify-center">
            <Icon
              name={getFileIcon() as any}
              size={24}
              className={file.type === 'folder' ? 'text-primary' : 'text-muted-foreground'}
            />
          </div>
        ) : (
          <AppImage
            src={file.thumbnail}
            alt={`Thumbnail preview of ${file.name}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* File Name */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground truncate" title={file.name}>
          {file.name}
        </h3>
      </div>

      {/* Owner */}
      <div className="hidden md:block w-32 flex-shrink-0">
        <p className="caption text-muted-foreground truncate">{file.owner}</p>
      </div>

      {/* Modified Date */}
      <div className="hidden sm:block w-32 flex-shrink-0">
        <p className="caption text-muted-foreground">{file.modifiedDate}</p>
      </div>

      {/* File Size */}
      {file.size && (
        <div className="hidden lg:block w-24 flex-shrink-0">
          <p className="caption text-muted-foreground">{file.size}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {file.isShared && (
          <Icon name="UserGroupIcon" size={16} className="text-muted-foreground" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStarToggle(file.id);
          }}
          className="p-1.5 rounded-md hover:bg-muted transition-smooth"
          aria-label={file.isStarred ? 'Remove from starred' : 'Add to starred'}
        >
          <Icon
            name="StarIcon"
            size={16}
            variant={file.isStarred ? 'solid' : 'outline'}
            className={file.isStarred ? 'text-accent' : 'text-muted-foreground'}
          />
        </button>
      </div>
    </div>
  );
};

export default FileItem;