'use client';

import Icon from '@/components/ui/AppIcon';

interface SortControlsProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

const SortControls = ({ sortBy, sortOrder, onSortChange }: SortControlsProps) => {
  const sortOptions = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'name', label: 'Name' },
    { id: 'modified', label: 'Date Modified' },
    { id: 'size', label: 'File Size' },
  ];

  const handleSortByChange = (newSortBy: string) => {
    onSortChange(newSortBy, sortOrder);
  };

  const handleSortOrderToggle = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <Icon name="ArrowsUpDownIcon" size={18} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Sort by:</span>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={sortBy}
          onChange={(e) => handleSortByChange(e.target.value)}
          className="px-3 py-1.5 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-smooth"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleSortOrderToggle}
          className="p-1.5 rounded-md bg-muted border border-border hover:bg-muted/80 transition-smooth"
          aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          <Icon
            name={sortOrder === 'asc' ? 'ArrowUpIcon' : 'ArrowDownIcon'}
            size={18}
            className="text-foreground"
          />
        </button>
      </div>
    </div>
  );
};

export default SortControls;