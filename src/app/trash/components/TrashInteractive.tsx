'use client';

import { useState, useEffect } from 'react';
import TrashBanner from './TrashBanner';
import TrashStats from './TrashStats';
import TrashToolbar from './TrashToolbar';
import TrashItem from './TrashItem';
import ConfirmationModal from './ConfirmationModal';
import EmptyTrashState from './EmptyTrashState';
import SearchBar from '@/components/common/SearchBar';

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

const TrashInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [trashItems, setTrashItems] = useState<TrashItemData[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'restore' | 'delete' | 'empty';
    itemIds: string[];
  }>({
    isOpen: false,
    type: 'restore',
    itemIds: [],
  });

  useEffect(() => {
    setIsHydrated(true);

    const mockTrashItems: TrashItemData[] = [
      {
        id: '1',
        name: 'Q4 Financial Report.pdf',
        type: 'file',
        size: '2.4 MB',
        deletedDate: 'Jan 15, 2026',
        originalLocation: '/Documents/Finance',
        daysRemaining: 28,
        icon: 'DocumentTextIcon',
      },
      {
        id: '2',
        name: 'Project Presentation.pptx',
        type: 'file',
        size: '8.7 MB',
        deletedDate: 'Jan 10, 2026',
        originalLocation: '/Documents/Projects',
        daysRemaining: 23,
        icon: 'PresentationChartBarIcon',
      },
      {
        id: '3',
        name: 'Old Photos',
        type: 'folder',
        size: '156 MB',
        deletedDate: 'Jan 5, 2026',
        originalLocation: '/Pictures',
        daysRemaining: 18,
        icon: 'FolderIcon',
      },
      {
        id: '4',
        name: 'Meeting Recording.mp4',
        type: 'file',
        size: '45.2 MB',
        deletedDate: 'Jan 14, 2026',
        originalLocation: '/Videos/Meetings',
        daysRemaining: 27,
        icon: 'VideoCameraIcon',
      },
      {
        id: '5',
        name: 'Draft Contract.docx',
        type: 'file',
        size: '1.2 MB',
        deletedDate: 'Dec 20, 2025',
        originalLocation: '/Documents/Legal',
        daysRemaining: 2,
        icon: 'DocumentTextIcon',
      },
      {
        id: '6',
        name: 'Marketing Assets',
        type: 'folder',
        size: '89 MB',
        deletedDate: 'Dec 25, 2025',
        originalLocation: '/Work/Marketing',
        daysRemaining: 7,
        icon: 'FolderIcon',
      },
      {
        id: '7',
        name: 'Budget Analysis.xlsx',
        type: 'file',
        size: '3.8 MB',
        deletedDate: 'Jan 12, 2026',
        originalLocation: '/Documents/Finance',
        daysRemaining: 25,
        icon: 'TableCellsIcon',
      },
      {
        id: '8',
        name: 'Team Photo.jpg',
        type: 'file',
        size: '4.5 MB',
        deletedDate: 'Dec 18, 2025',
        originalLocation: '/Pictures/Events',
        daysRemaining: 1,
        icon: 'PhotoIcon',
      },
    ];

    setTrashItems(mockTrashItems);
  }, []);

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleRestoreSelected = () => {
    setConfirmModal({
      isOpen: true,
      type: 'restore',
      itemIds: Array.from(selectedItems),
    });
  };

  const handleDeleteSelected = () => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      itemIds: Array.from(selectedItems),
    });
  };

  const handleEmptyTrash = () => {
    setConfirmModal({
      isOpen: true,
      type: 'empty',
      itemIds: trashItems.map((item) => item.id),
    });
  };

  const handleRestoreItem = (id: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'restore',
      itemIds: [id],
    });
  };

  const handleDeleteItem = (id: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      itemIds: [id],
    });
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === 'restore') {
      setTrashItems(trashItems.filter((item) => !confirmModal.itemIds.includes(item.id)));
      setSelectedItems(new Set());
    } else if (confirmModal.type === 'delete' || confirmModal.type === 'empty') {
      setTrashItems(trashItems.filter((item) => !confirmModal.itemIds.includes(item.id)));
      setSelectedItems(new Set());
    }
  };

  const handleSortChange = (sort: string) => {
    const sorted = [...trashItems].sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return parseFloat(a.size) - parseFloat(b.size);
        case 'daysRemaining':
          return a.daysRemaining - b.daysRemaining;
        case 'deletionDate':
        default:
          return 0;
      }
    });
    setTrashItems(sorted);
  };

  const handleFilterChange = (filter: string) => {
    // Filter logic would be implemented here
    console.log('Filter changed to:', filter);
  };

  const getModalContent = () => {
    const count = confirmModal.itemIds.length;
    switch (confirmModal.type) {
      case 'restore':
        return {
          title: 'Restore Items',
          message: `Are you sure you want to restore ${count} ${count === 1 ? 'item' : 'items'}? ${count === 1 ? 'It' : 'They'} will be moved back to ${count === 1 ? 'its' : 'their'} original location.`,
          confirmText: 'Restore',
          variant: 'success' as const,
        };
      case 'delete':
        return {
          title: 'Delete Forever',
          message: `Are you sure you want to permanently delete ${count} ${count === 1 ? 'item' : 'items'}? This action cannot be undone.`,
          confirmText: 'Delete Forever',
          variant: 'destructive' as const,
        };
      case 'empty':
        return {
          title: 'Empty Trash',
          message: `Are you sure you want to permanently delete all ${count} items in trash? This action cannot be undone.`,
          confirmText: 'Empty Trash',
          variant: 'destructive' as const,
        };
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-muted rounded-md animate-pulse mb-6" />
          <div className="h-32 bg-muted rounded-md animate-pulse mb-6" />
          <div className="h-64 bg-muted rounded-md animate-pulse" />
        </div>
      </div>
    );
  }

  const modalContent = getModalContent();
  const totalSize = trashItems.reduce((acc, item) => {
    if (item.type === 'file') {
      const size = parseFloat(item.size);
      return acc + size;
    }
    return acc + parseFloat(item.size);
  }, 0);

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">
            Trash
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage deleted files and folders with 30-day retention
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar placeholder="Search trash..." />
        </div>

        {trashItems.length > 0 ? (
          <>
            {/* Banner */}
            <TrashBanner retentionDays={30} itemCount={trashItems.length} />

            {/* Stats */}
            <TrashStats
              totalSize={`${totalSize.toFixed(1)} MB`}
              itemCount={trashItems.length}
              recoveredToday={3}
            />

            {/* Toolbar */}
            <TrashToolbar
              selectedCount={selectedItems.size}
              onRestoreSelected={handleRestoreSelected}
              onDeleteSelected={handleDeleteSelected}
              onEmptyTrash={handleEmptyTrash}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
            />

            {/* Trash Items List */}
            <div className="space-y-3">
              {trashItems.map((item) => (
                <TrashItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onSelect={handleSelectItem}
                  onRestore={handleRestoreItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyTrashState />
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={handleConfirmAction}
          title={modalContent.title}
          message={modalContent.message}
          confirmText={modalContent.confirmText}
          confirmVariant={modalContent.variant}
        />
      </div>
    </div>
  );
};

export default TrashInteractive;