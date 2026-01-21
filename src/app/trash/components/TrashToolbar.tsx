'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TrashToolbarProps {
  selectedCount: number;
  onRestoreSelected: () => void;
  onDeleteSelected: () => void;
  onEmptyTrash: () => void;
  onSortChange: (sort: string) => void;
  onFilterChange: (filter: string) => void;
}

const TrashToolbar = ({
  selectedCount,
  onRestoreSelected,
  onDeleteSelected,
  onEmptyTrash,
  onSortChange,
  onFilterChange,
}: TrashToolbarProps) => {
  const [sortBy, setSortBy] = useState('deletionDate');
  const [filterBy, setFilterBy] = useState('all');

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange(value);
  };

  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    onFilterChange(value);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Section - Bulk Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {selectedCount > 0 ? (
            <>
              <span className="text-sm font-medium text-foreground">
                {selectedCount} selected
              </span>
              <button
                onClick={onRestoreSelected}
                className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded-md text-sm font-medium hover:shadow-brand-lg active:scale-[0.97] transition-smooth"
              >
                <Icon name="ArrowPathIcon" size={16} />
                Restore
              </button>
              <button
                onClick={onDeleteSelected}
                className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:shadow-brand-lg active:scale-[0.97] transition-smooth"
              >
                <Icon name="TrashIcon" size={16} />
                Delete Forever
              </button>
            </>
          ) : (
            <button
              onClick={onEmptyTrash}
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:shadow-brand-lg active:scale-[0.97] transition-smooth"
            >
              <Icon name="TrashIcon" size={16} />
              Empty Trash
            </button>
          )}
        </div>

        {/* Right Section - Sort and Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm text-muted-foreground">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            >
              <option value="deletionDate">Deletion Date</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="daysRemaining">Days Remaining</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter-select" className="text-sm text-muted-foreground">
              Filter:
            </label>
            <select
              id="filter-select"
              value={filterBy}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            >
              <option value="all">All Items</option>
              <option value="documents">Documents</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
              <option value="expiringSoon">Expiring Soon</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrashToolbar;