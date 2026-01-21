'use client';

import Icon from '@/components/ui/AppIcon';

interface RecentSearchesProps {
  searches: string[];
  onSearchClick: (query: string) => void;
  onClearAll: () => void;
}

const RecentSearches = ({ searches, onSearchClick, onClearAll }: RecentSearchesProps) => {
  if (searches.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-brand">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name="ClockIcon" size={18} className="text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Recent Searches</h3>
        </div>
        <button
          onClick={onClearAll}
          className="caption text-muted-foreground hover:text-foreground transition-smooth"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSearchClick(search)}
            className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 transition-smooth"
          >
            <span>{search}</span>
            <Icon name="MagnifyingGlassIcon" size={14} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;