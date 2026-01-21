'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/common/Sidebar';
import SearchBar from '@/components/common/SearchBar';
import FileSharingModal from '@/components/common/FileSharingModal';
import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';
import FileItem from './FileItem';
import ContextMenu from './ContextMenu';
import UploadZone from './UploadZone';
import UploadProgress from './UploadProgress';
import DetailsPanel from './DetailsPanel';

interface FileData {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modifiedDate: string;
  thumbnail?: string;
  isShared: boolean;
  isStarred: boolean;
  owner: string;
  createdDate: string;
  sharedWith: Array<{ name: string; email: string; permission: string }>;
  activity: Array<{ action: string; user: string; timestamp: string }>;
}

interface UploadItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const MainDashboardInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    fileId: string;
  }>({ isOpen: false, position: { x: 0, y: 0 }, fileId: '' });
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [detailsPanel, setDetailsPanel] = useState<{ isOpen: boolean; fileId: string }>({
    isOpen: false,
    fileId: '',
  });
  const [sharingModal, setSharingModal] = useState<{ isOpen: boolean; fileId: string }>({
    isOpen: false,
    fileId: '',
  });
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');

  const mockFiles: FileData[] = [
    {
      id: '1',
      name: 'Project Documents',
      type: 'folder',
      modifiedDate: '01/15/2026',
      isShared: true,
      isStarred: true,
      owner: 'John Doe',
      createdDate: '12/01/2025',
      sharedWith: [
        { name: 'Sarah Wilson', email: 'sarah.wilson@example.com', permission: 'Editor' },
        { name: 'Mike Johnson', email: 'mike.johnson@example.com', permission: 'Viewer' },
      ],
      activity: [
        { action: 'Shared with Sarah Wilson', user: 'John Doe', timestamp: '2 hours ago' },
        { action: 'Created folder', user: 'John Doe', timestamp: '3 days ago' },
      ],
    },
    {
      id: '2',
      name: 'Meeting Notes 2026.pdf',
      type: 'file',
      size: '2.4 MB',
      modifiedDate: '01/16/2026',
      thumbnail: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg',
      isShared: false,
      isStarred: false,
      owner: 'John Doe',
      createdDate: '01/16/2026',
      sharedWith: [],
      activity: [
        { action: 'File uploaded', user: 'John Doe', timestamp: '1 hour ago' },
      ],
    },
    {
      id: '3',
      name: 'Budget Spreadsheet.xlsx',
      type: 'file',
      size: '1.8 MB',
      modifiedDate: '01/14/2026',
      isShared: true,
      isStarred: true,
      owner: 'John Doe',
      createdDate: '01/10/2026',
      sharedWith: [
        { name: 'Emily Davis', email: 'emily.davis@example.com', permission: 'Editor' },
      ],
      activity: [
        { action: 'Modified by Emily Davis', user: 'Emily Davis', timestamp: '5 hours ago' },
        { action: 'Shared with Emily Davis', user: 'John Doe', timestamp: '2 days ago' },
      ],
    },
    {
      id: '4',
      name: 'Design Assets',
      type: 'folder',
      modifiedDate: '01/13/2026',
      isShared: false,
      isStarred: false,
      owner: 'John Doe',
      createdDate: '01/05/2026',
      sharedWith: [],
      activity: [
        { action: 'Created folder', user: 'John Doe', timestamp: '1 week ago' },
      ],
    },
    {
      id: '5',
      name: 'Presentation.pptx',
      type: 'file',
      size: '5.2 MB',
      modifiedDate: '01/12/2026',
      thumbnail: 'https://images.pixabay.com/photo/2016/11/29/06/15/plans-1867745_1280.jpg',
      isShared: true,
      isStarred: false,
      owner: 'John Doe',
      createdDate: '01/08/2026',
      sharedWith: [
        { name: 'David Brown', email: 'david.brown@example.com', permission: 'Viewer' },
      ],
      activity: [
        { action: 'Shared with David Brown', user: 'John Doe', timestamp: '3 days ago' },
      ],
    },
    {
      id: '6',
      name: 'Team Photo.jpg',
      type: 'file',
      size: '3.6 MB',
      modifiedDate: '01/11/2026',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
      isShared: false,
      isStarred: true,
      owner: 'John Doe',
      createdDate: '01/11/2026',
      sharedWith: [],
      activity: [
        { action: 'File uploaded', user: 'John Doe', timestamp: '6 days ago' },
      ],
    },
  ];

  const breadcrumbItems = [
    { label: 'My Drive', path: '/main-dashboard' },
  ];

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleFileSelect = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === mockFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(mockFiles.map((f) => f.id));
    }
  };

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      fileId,
    });
  };

  const handleDoubleClick = (fileId: string) => {
    const file = mockFiles.find((f) => f.id === fileId);
    if (file?.type === 'folder') {
      // Navigate to folder
      console.log('Navigate to folder:', fileId);
    }
  };

  const handleStarToggle = (fileId: string) => {
    console.log('Toggle star for file:', fileId);
  };

  const handleFilesSelected = (files: FileList) => {
    const newUploads: UploadItem[] = Array.from(files).map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploads((prev) => [...prev, ...newUploads]);
    setShowUploadZone(false);

    // Simulate upload progress
    newUploads.forEach((upload) => {
      const interval = setInterval(() => {
        setUploads((prev) =>
          prev.map((u) => {
            if (u.id === upload.id && u.progress < 100) {
              const newProgress = Math.min(u.progress + 10, 100);
              return {
                ...u,
                progress: newProgress,
                status: newProgress === 100 ? 'completed' : 'uploading',
              };
            }
            return u;
          })
        );
      }, 500);

      setTimeout(() => clearInterval(interval), 5500);
    });
  };

  const handleCancelUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const handleDismissUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const handleOpenDetails = (fileId: string) => {
    setDetailsPanel({ isOpen: true, fileId });
  };

  const handleShare = (fileId: string) => {
    setSharingModal({ isOpen: true, fileId });
  };

  const selectedFile = detailsPanel.isOpen
    ? mockFiles.find((f) => f.id === detailsPanel.fileId) || null
    : null;

  const sharingFile = sharingModal.isOpen
    ? mockFiles.find((f) => f.id === sharingModal.fileId)
    : null;

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="lg:pl-60">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border shadow-brand">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <SearchBar placeholder="Search in My Drive" />
              </div>
              <button
                className="p-2 rounded-md hover:bg-muted transition-smooth lg:hidden"
                aria-label="Menu"
              >
                <Icon name="Bars3Icon" size={24} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} className="mb-6" />

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={() => setShowUploadZone(!showUploadZone)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:shadow-brand-lg active:scale-[0.97] transition-smooth"
            >
              <Icon name="CloudArrowUpIcon" size={18} />
              <span>Upload</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:shadow-brand-lg active:scale-[0.97] transition-smooth">
              <Icon name="FolderPlusIcon" size={18} />
              <span>New Folder</span>
            </button>

            {selectedFiles.length > 0 && (
              <>
                <button
                  onClick={() => handleShare(selectedFiles[0])}
                  className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 active:scale-[0.97] transition-smooth"
                >
                  <Icon name="ShareIcon" size={18} />
                  <span>Share</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 active:scale-[0.97] transition-smooth">
                  <Icon name="TrashIcon" size={18} />
                  <span>Delete</span>
                </button>
              </>
            )}

            <div className="ml-auto flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
                className="px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              >
                <option value="name">Name</option>
                <option value="date">Date modified</option>
                <option value="size">Size</option>
              </select>

              <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-smooth ${
                    viewMode === 'grid' ? 'bg-background shadow-brand' : 'hover:bg-background/50'
                  }`}
                  aria-label="Grid view"
                >
                  <Icon name="Squares2X2Icon" size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-smooth ${
                    viewMode === 'list' ? 'bg-background shadow-brand' : 'hover:bg-background/50'
                  }`}
                  aria-label="List view"
                >
                  <Icon name="ListBulletIcon" size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Upload Zone */}
          {showUploadZone && (
            <div className="mb-6">
              <UploadZone onFilesSelected={handleFilesSelected} />
            </div>
          )}

          {/* Selection Info */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-4 mb-4 px-4 py-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-foreground">
                {selectedFiles.length} item(s) selected
              </p>
              <button
                onClick={handleSelectAll}
                className="text-sm text-primary hover:underline"
              >
                {selectedFiles.length === mockFiles.length ? 'Deselect all' : 'Select all'}
              </button>
              <button
                onClick={() => setSelectedFiles([])}
                className="ml-auto text-sm text-muted-foreground hover:text-foreground"
              >
                Clear selection
              </button>
            </div>
          )}

          {/* Files Grid/List */}
          <div
            className={
              viewMode === 'grid' ?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' :'space-y-2'
            }
          >
            {mockFiles.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                viewMode={viewMode}
                isSelected={selectedFiles.includes(file.id)}
                onSelect={handleFileSelect}
                onContextMenu={handleContextMenu}
                onDoubleClick={handleDoubleClick}
                onStarToggle={handleStarToggle}
              />
            ))}
          </div>

          {/* Empty State */}
          {mockFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <Icon name="FolderIcon" size={48} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                No files yet
              </h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                Upload your first file or create a folder to get started with CloudDrive
              </p>
              <button
                onClick={() => setShowUploadZone(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:shadow-brand-lg active:scale-[0.97] transition-smooth"
              >
                <Icon name="CloudArrowUpIcon" size={20} />
                <span>Upload Files</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
        onRename={() => console.log('Rename')}
        onMove={() => console.log('Move')}
        onShare={() => {
          handleShare(contextMenu.fileId);
          setContextMenu({ ...contextMenu, isOpen: false });
        }}
        onDownload={() => console.log('Download')}
        onDelete={() => console.log('Delete')}
        onDetails={() => {
          handleOpenDetails(contextMenu.fileId);
          setContextMenu({ ...contextMenu, isOpen: false });
        }}
      />

      {/* Upload Progress */}
      <UploadProgress
        uploads={uploads}
        onCancel={handleCancelUpload}
        onDismiss={handleDismissUpload}
      />

      {/* Details Panel */}
      <DetailsPanel
        isOpen={detailsPanel.isOpen}
        onClose={() => setDetailsPanel({ isOpen: false, fileId: '' })}
        file={selectedFile}
      />

      {/* Sharing Modal */}
      <FileSharingModal
        isOpen={sharingModal.isOpen}
        onClose={() => setSharingModal({ isOpen: false, fileId: '' })}
        fileName={sharingFile?.name}
        fileId={sharingFile?.id}
      />
    </div>
  );
};

export default MainDashboardInteractive;