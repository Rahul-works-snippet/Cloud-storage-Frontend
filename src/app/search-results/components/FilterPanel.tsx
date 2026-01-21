'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface FilterPanelProps {
  onFilterChange: (filters: SearchFilters) => void;
  resultCount: number;
}

export interface SearchFilters {
  fileTypes: string[];
  dateRange: string;
  owner: string;
  sharingStatus: string;
  sizeRange: string;
}

const FilterPanel = ({ onFilterChange, resultCount }: FilterPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    fileTypes: [],
    dateRange: 'any',
    owner: 'anyone',
    sharingStatus: 'all',
    sizeRange: 'any',
  });

  const fileTypeOptions: FilterOption[] = [
    { id: 'document', label: 'Documents', count: 45 },
    { id: 'image', label: 'Images', count: 28 },
    { id: 'video', label: 'Videos', count: 12 },
    { id: 'audio', label: 'Audio', count: 8 },
    { id: 'pdf', label: 'PDFs', count: 34 },
    { id: 'spreadsheet', label: 'Spreadsheets', count: 19 },
  ];

  const dateRangeOptions = [
    { id: 'any', label: 'Any time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Past week' },
    { id: 'month', label: 'Past month' },
    { id: 'year', label: 'Past year' },
  ];

  const ownerOptions = [
    { id: 'anyone', label: 'Anyone' },
    { id: 'me', label: 'Owned by me' },
    { id: 'shared', label: 'Shared with me' },
  ];

  const sharingStatusOptions = [
    { id: 'all', label: 'All files' },
    { id: 'shared', label: 'Shared' },
    { id: 'private', label: 'Private' },
  ];

  const sizeRangeOptions = [
    { id: 'any', label: 'Any size' },
    { id: 'small', label: 'Less than 10 MB' },
    { id: 'medium', label: '10 MB - 100 MB' },
    { id: 'large', label: 'More than 100 MB' },
  ];

  const handleFileTypeToggle = (typeId: string) => {
    const newFileTypes = activeFilters.fileTypes.includes(typeId)
      ? activeFilters.fileTypes.filter((id) => id !== typeId)
      : [...activeFilters.fileTypes, typeId];

    const newFilters = { ...activeFilters, fileTypes: newFileTypes };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (filterKey: keyof SearchFilters, value: string) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: SearchFilters = {
      fileTypes: [],
      dateRange: 'any',
      owner: 'anyone',
      sharingStatus: 'all',
      sizeRange: 'any',
    };
    setActiveFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters =
    activeFilters.fileTypes.length > 0 ||
    activeFilters.dateRange !== 'any' ||
    activeFilters.owner !== 'anyone' ||
    activeFilters.sharingStatus !== 'all' ||
    activeFilters.sizeRange !== 'any';

  return (
    <div className="bg-card border border-border rounded-lg shadow-brand overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="FunnelIcon" size={18} className="text-muted-foreground" />
          <h2 className="text-sm font-medium text-foreground">Filters</h2>
          <span className="caption text-muted-foreground">({resultCount} results)</span>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="caption text-primary hover:text-primary/80 transition-smooth"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md hover:bg-muted transition-smooth lg:hidden"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            <Icon
              name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
              size={18}
              className="text-muted-foreground"
            />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="p-4 space-y-6">
          {/* File Type Filter */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">File Type</h3>
            <div className="space-y-2">
              {fileTypeOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.fileTypes.includes(option.id)}
                    onChange={() => handleFileTypeToggle(option.id)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-smooth"
                  />
                  <span className="text-sm text-foreground group-hover:text-primary transition-smooth flex-1">
                    {option.label}
                  </span>
                  <span className="caption text-muted-foreground">{option.count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Date Modified</h3>
            <select
              value={activeFilters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-smooth"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Owner Filter */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Owner</h3>
            <select
              value={activeFilters.owner}
              onChange={(e) => handleFilterChange('owner', e.target.value)}
              className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-smooth"
            >
              {ownerOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sharing Status Filter */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Sharing Status</h3>
            <select
              value={activeFilters.sharingStatus}
              onChange={(e) => handleFilterChange('sharingStatus', e.target.value)}
              className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-smooth"
            >
              {sharingStatusOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Size Range Filter */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">File Size</h3>
            <select
              value={activeFilters.sizeRange}
              onChange={(e) => handleFilterChange('sizeRange', e.target.value)}
              className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-smooth"
            >
              {sizeRangeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;