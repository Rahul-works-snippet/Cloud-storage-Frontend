'use client';

import { useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onRename: () => void;
  onMove: () => void;
  onShare: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onDetails: () => void;
}

const ContextMenu = ({
  isOpen,
  position,
  onClose,
  onRename,
  onMove,
  onShare,
  onDownload,
  onDelete,
  onDetails,
}: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { label: 'Rename', icon: 'PencilIcon', onClick: onRename },
    { label: 'Move to', icon: 'FolderIcon', onClick: onMove },
    { label: 'Share', icon: 'ShareIcon', onClick: onShare },
    { label: 'Download', icon: 'ArrowDownTrayIcon', onClick: onDownload },
    { label: 'Details', icon: 'InformationCircleIcon', onClick: onDetails },
    { label: 'Delete', icon: 'TrashIcon', onClick: onDelete, danger: true },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] w-56 bg-popover border border-border rounded-lg shadow-brand-xl overflow-hidden"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <ul className="py-2">
        {menuItems.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-smooth text-left
                ${
                  item.danger
                    ? 'text-destructive hover:bg-destructive/10' :'text-popover-foreground hover:bg-muted'
                }
              `}
            >
              <Icon name={item.icon as any} size={18} className="flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;