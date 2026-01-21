'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ 
  placeholder = 'Search files and folders...', 
  className = '' 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const recentSearches = [
    'Project Documents',
    'Meeting Notes 2026',
    'Budget Spreadsheet',
    'Design Assets',
  ];

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-md bg-muted border
            transition-smooth
            ${
              isFocused
                ? 'border-ring shadow-brand ring-2 ring-ring ring-offset-2'
                : 'border-border'
            }
          `}
        >
          <Icon name="MagnifyingGlassIcon" size={18} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="flex-shrink-0 p-1 rounded-sm hover:bg-background transition-smooth"
              aria-label="Clear search"
            >
              <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-md shadow-brand-lg z-50 overflow-hidden">
          <div className="p-2">
            <p className="caption text-muted-foreground px-3 py-2">Recent Searches</p>
            <ul className="space-y-1">
              {recentSearches.map((search, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm text-popover-foreground hover:bg-muted transition-smooth text-left"
                  >
                    <Icon name="ClockIcon" size={16} className="text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 truncate">{search}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;