'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/common/Sidebar';
import SearchBar from '@/components/common/SearchBar';
import FileSharingModal from '@/components/common/FileSharingModal';
import Breadcrumb from '@/components/common/Breadcrumb';
import FilterPanel from './FilterPanel';
import SortControls from './SortControls';
import SearchResultItem from './SearchResultItem';
import RecentSearches from './RecentSearches';
import type { SearchFilters } from './FilterPanel';
import Icon from '@/components/ui/AppIcon';

interface SearchResult {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  owner: string;
  path: string;
  thumbnail?: string;
  isShared: boolean;
}

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<SearchFilters>({
    fileTypes: [],
    dateRange: 'any',
    owner: 'anyone',
    sharingStatus: 'all',
    sizeRange: 'any'
  });
  const [sharingModalOpen, setSharingModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{id: string;name: string;} | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([
  'Project Documents',
  'Meeting Notes 2026',
  'Budget Spreadsheet',
  'Design Assets']
  );

  const mockResults: SearchResult[] = [
  {
    id: '1',
    name: 'Q1 2026 Financial Report.pdf',
    type: 'PDF',
    size: '2.4 MB',
    modified: '01/15/2026',
    owner: 'John Doe',
    path: '/My Drive/Finance/Reports',
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_15eb358c2-1767976619121.png",
    isShared: true
  },
  {
    id: '2',
    name: 'Project Proposal Draft.docx',
    type: 'Document',
    size: '856 KB',
    modified: '01/14/2026',
    owner: 'Jane Smith',
    path: '/Shared with me/Projects',
    isShared: true
  },
  {
    id: '3',
    name: 'Team Meeting Recording.mp4',
    type: 'Video',
    size: '145 MB',
    modified: '01/13/2026',
    owner: 'John Doe',
    path: '/My Drive/Meetings/January',
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1c4a2a387-1768400837282.png",
    isShared: false
  },
  {
    id: '4',
    name: 'Marketing Campaign Assets.zip',
    type: 'Archive',
    size: '89 MB',
    modified: '01/12/2026',
    owner: 'Marketing Team',
    path: '/Shared with me/Marketing',
    isShared: true
  },
  {
    id: '5',
    name: 'Product Roadmap 2026.xlsx',
    type: 'Spreadsheet',
    size: '1.2 MB',
    modified: '01/11/2026',
    owner: 'John Doe',
    path: '/My Drive/Planning',
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_18a5b14d7-1768282682194.png",
    isShared: true
  },
  {
    id: '6',
    name: 'Client Presentation.pptx',
    type: 'Presentation',
    size: '5.8 MB',
    modified: '01/10/2026',
    owner: 'Sales Team',
    path: '/Shared with me/Sales',
    isShared: true
  },
  {
    id: '7',
    name: 'Design Mockups v3.fig',
    type: 'Design',
    size: '12 MB',
    modified: '01/09/2026',
    owner: 'Design Team',
    path: '/Shared with me/Design',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    isShared: true
  },
  {
    id: '8',
    name: 'Employee Handbook 2026.pdf',
    type: 'PDF',
    size: '3.1 MB',
    modified: '01/08/2026',
    owner: 'HR Department',
    path: '/Shared with me/HR',
    isShared: false
  }];


  useEffect(() => {
    setIsHydrated(true);
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleShare = (id: string, name: string) => {
    setSelectedFile({ id, name });
    setSharingModalOpen(true);
  };

  const handleDownload = (id: string, name: string) => {
    console.log(`Downloading file: ${name} (ID: ${id})`);
  };

  const handlePreview = (id: string, name: string) => {
    console.log(`Previewing file: ${name} (ID: ${id})`);
  };

  const handleRecentSearchClick = (query: string) => {
    router.push(`/search-results?q=${encodeURIComponent(query)}`);
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  const breadcrumbItems = [
  { label: 'My Drive', path: '/main-dashboard' },
  { label: 'Search Results', path: '/search-results' }];


  if (!isHydrated) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-60 border-r border-border" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading search results...</div>
        </div>
      </div>);

  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden lg:ml-60">
        {/* Header */}
        <header className="flex-shrink-0 bg-card border-b border-border px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <Breadcrumb items={breadcrumbItems} />
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-md hover:bg-muted transition-smooth"
                aria-label="View options">

                <Icon name="Cog6ToothIcon" size={20} className="text-muted-foreground" />
              </button>
            </div>
          </div>
          <SearchBar className="max-w-2xl" />
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
            {/* Search Query Display */}
            {searchQuery &&
            <div className="mb-6">
                <h1 className="text-2xl font-heading font-semibold text-foreground mb-2">
                  Search results for "{searchQuery}"
                </h1>
                <p className="text-sm text-muted-foreground">
                  Found {mockResults.length} results
                </p>
              </div>
            }

            {/* Recent Searches */}
            {!searchQuery &&
            <div className="mb-6">
                <RecentSearches
                searches={recentSearches}
                onSearchClick={handleRecentSearchClick}
                onClearAll={handleClearRecentSearches} />

              </div>
            }

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
              <aside className="lg:col-span-1">
                <FilterPanel
                  onFilterChange={handleFilterChange}
                  resultCount={mockResults.length} />

              </aside>

              {/* Results Area */}
              <div className="lg:col-span-3 space-y-4">
                {/* Sort Controls */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <SortControls
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortChange={handleSortChange} />

                  <div className="flex items-center gap-2">
                    <span className="caption text-muted-foreground">
                      {mockResults.length} files
                    </span>
                  </div>
                </div>

                {/* Results List */}
                {mockResults.length > 0 ?
                <div className="space-y-3">
                    {mockResults.map((result) =>
                  <SearchResultItem
                    key={result.id}
                    {...result}
                    onShare={handleShare}
                    onDownload={handleDownload}
                    onPreview={handlePreview} />

                  )}
                  </div> :

                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Icon name="MagnifyingGlassIcon" size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Try adjusting your search query or filters to find what you're looking for
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* File Sharing Modal */}
      {selectedFile &&
      <FileSharingModal
        isOpen={sharingModalOpen}
        onClose={() => {
          setSharingModalOpen(false);
          setSelectedFile(null);
        }}
        fileName={selectedFile.name}
        fileId={selectedFile.id} />

      }
    </div>);

}

export default function SearchResultsInteractive() {
  return (
    <Suspense
      fallback={
      <div className="flex h-screen bg-background items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading search results...</div>
        </div>
      }>

      <SearchResultsContent />
    </Suspense>);

}