'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TrashItemData {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: string;
  deletedDate: string;
  originalLocation: string;
  daysRemaining: number;
  icon: string;
}

interface TrashItemProps {
  item: TrashItemData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

const TrashItem = ({
  item,
  isSelected,
  onSelect,
  onRestore,
  onDelete,
}: TrashItemProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getWarningLevel = (days: number) => {
    if (days <= 3) return 'critical';
    if (days <= 7) return 'warning';
    return 'normal';
  };

  const warningLevel = getWarningLevel(item.daysRemaining);

  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-lg border transition-smooth
        ${isSelected ? 'bg-primary/5 border-primary' : 'bg-card border-border hover:border-primary/50'}
      `}
    >
      {/* Checkbox */}
      <button
        onClick={() => onSelect(item.id)}
        className="flex-shrink-0 w-5 h-5 rounded border-2 border-border flex items-center justify-center hover:border-primary transition-smooth"
        aria-label={`Select ${item.name}`}
      >
        {isSelected && (
          <Icon name="CheckIcon" size={14} className="text-primary" />
        )}
      </button>

      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-muted flex items-center justify-center">
        <Icon name={item.icon as any} size={20} className="text-muted-foreground" />
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-medium text-foreground truncate">
            {item.name}
          </h3>
          {warningLevel !== 'normal' && (
            <Icon
              name="ExclamationTriangleIcon"
              size={16}
              className={warningLevel === 'critical' ? 'text-destructive' : 'text-warning'}
            />
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <span>{item.type === 'file' ? item.size : 'Folder'}</span>
          <span>•</span>
          <span>Deleted {item.deletedDate}</span>
          <span>•</span>
          <span
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span
              className={`
                ${warningLevel === 'critical' ? 'text-destructive font-medium' : ''}
                ${warningLevel === 'warning' ? 'text-warning font-medium' : ''}
              `}
            >
              {item.daysRemaining} days remaining
            </span>
            {showTooltip && (
              <span className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-brand-lg whitespace-nowrap z-50">
                Original location: {item.originalLocation}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onRestore(item.id)}
          className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded-md text-sm font-medium hover:shadow-brand-lg active:scale-[0.97] transition-smooth"
          aria-label={`Restore ${item.name}`}
        >
          <Icon name="ArrowPathIcon" size={16} />
          <span className="hidden sm:inline">Restore</span>
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:shadow-brand-lg active:scale-[0.97] transition-smooth"
          aria-label={`Delete ${item.name} forever`}
        >
          <Icon name="TrashIcon" size={16} />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default TrashItem;