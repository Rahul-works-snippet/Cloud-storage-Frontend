'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/common/Sidebar';
import SearchBar from '@/components/common/SearchBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';
import FileCard from './FileCard';
import SharedUsersList from './SharedUsersList';
import AddPeopleForm from './AddPeopleForm';
import PublicLinkSection from './PublicLinkSection';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  thumbnail: string;
  thumbnailAlt: string;
  lastModified: string;
}

interface SharedUser {
  id: string;
  name: string;
  email: string;
  permission: 'viewer' | 'editor' | 'owner';
  accessDate: string;
  avatar: string;
  avatarAlt: string;
}

const FileSharingInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [isPublicLinkEnabled, setIsPublicLinkEnabled] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    // Initialize mock shared users
    setSharedUsers([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      permission: 'owner',
      accessDate: '01/10/2026',
      avatar: '',
      avatarAlt: 'Professional woman with brown hair in business attire'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      permission: 'editor',
      accessDate: '01/15/2026',
      avatar: '',
      avatarAlt: 'Asian man with glasses in casual shirt'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      permission: 'viewer',
      accessDate: '01/16/2026',
      avatar: '',
      avatarAlt: 'Hispanic woman with long dark hair smiling'
    }]
    );
  }, []);

  const mockFiles: FileItem[] = [
  {
    id: 'f1',
    name: 'Q4 Financial Report.pdf',
    type: 'pdf',
    size: '2.4 MB',
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_145736fd3-1766858066490.png",
    thumbnailAlt: 'Financial charts and graphs on paper with calculator and pen',
    lastModified: '01/15/2026'
  },
  {
    id: 'f2',
    name: 'Marketing Strategy 2026.pptx',
    type: 'pptx',
    size: '5.8 MB',
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_11409089c-1766866232196.png",
    thumbnailAlt: 'Business presentation slides on laptop screen in modern office',
    lastModified: '01/14/2026'
  },
  {
    id: 'f3',
    name: 'Product Roadmap.xlsx',
    type: 'xlsx',
    size: '1.2 MB',
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1374c6b14-1766906573877.png",
    thumbnailAlt: 'Spreadsheet with colorful data charts and tables on computer monitor',
    lastModified: '01/16/2026'
  }];


  const breadcrumbItems = [
  { label: 'My Drive', path: '/main-dashboard' },
  { label: 'Documents', path: '/main-dashboard' },
  { label: 'Share Files', path: '/file-sharing' }];


  const handleFileSelect = (fileId: string) => {
    setSelectedFiles((prev) =>
    prev.includes(fileId) ?
    prev.filter((id) => id !== fileId) :
    [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === mockFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(mockFiles.map((f) => f.id));
    }
  };

  const handleAddUser = (email: string, permission: 'viewer' | 'editor') => {
    const newUser: SharedUser = {
      id: Date.now().toString(),
      name: email.split('@')[0].replace('.', ' '),
      email,
      permission,
      accessDate: '01/17/2026',
      avatar: '',
      avatarAlt: 'User profile avatar'
    };
    setSharedUsers([...sharedUsers, newUser]);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handlePermissionChange = (
  userId: string,
  permission: 'viewer' | 'editor') =>
  {
    setSharedUsers(
      sharedUsers.map((user) =>
      user.id === userId ? { ...user, permission } : user
      )
    );
  };

  const handleRevokeAccess = (userId: string) => {
    setSharedUsers(sharedUsers.filter((user) => user.id !== userId));
  };

  const handleSetExpiry = (userId: string) => {
    alert(`Setting expiry date for user ${userId}`);
  };

  const handleTogglePublicLink = (enabled: boolean) => {
    setIsPublicLinkEnabled(enabled);
  };

  if (!isHydrated) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-60 border-r border-border bg-card" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>);

  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden lg:ml-60">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-border bg-card">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h1 className="text-2xl font-heading font-semibold text-foreground">
                Share Files
              </h1>
              <SearchBar className="hidden md:block w-full max-w-md" />
            </div>
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </header>

        {/* Success Message */}
        {showSuccessMessage &&
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-4">
            <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-lg">
              <Icon
              name="CheckCircleIcon"
              size={20}
              className="text-success flex-shrink-0" />

              <p className="text-sm text-success-foreground">
                User added successfully! They will receive an email invitation.
              </p>
            </div>
          </div>
        }

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - File Selection */}
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6 shadow-brand">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-heading font-semibold text-foreground">
                      Select files to share
                    </h2>
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-primary hover:underline transition-smooth">

                      {selectedFiles.length === mockFiles.length ?
                      'Deselect all' : 'Select all'}
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {mockFiles.map((file) =>
                    <FileCard
                      key={file.id}
                      fileName={file.name}
                      fileType={file.type}
                      fileSize={file.size}
                      thumbnail={file.thumbnail}
                      thumbnailAlt={file.thumbnailAlt}
                      lastModified={file.lastModified}
                      isSelected={selectedFiles.includes(file.id)}
                      onSelect={() => handleFileSelect(file.id)} />

                    )}
                  </div>

                  {selectedFiles.length > 0 &&
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{selectedFiles.length}</span>{' '}
                        {selectedFiles.length === 1 ? 'file' : 'files'} selected
                      </p>
                    </div>
                  }
                </div>
              </div>

              {/* Right Column - Sharing Options */}
              <div className="space-y-6">
                {/* Add People */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-brand">
                  <AddPeopleForm onAddUser={handleAddUser} />
                </div>

                {/* Shared Users List */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-brand">
                  <SharedUsersList
                    users={sharedUsers}
                    onPermissionChange={handlePermissionChange}
                    onRevokeAccess={handleRevokeAccess}
                    onSetExpiry={handleSetExpiry} />

                </div>

                {/* Public Link Section */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-brand">
                  <PublicLinkSection
                    fileId={selectedFiles[0] || 'demo123'}
                    isPublicLinkEnabled={isPublicLinkEnabled}
                    onTogglePublicLink={handleTogglePublicLink} />

                </div>

                {/* Notification Settings */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-brand">
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Notification preferences
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-foreground">
                        Notify me when someone views
                      </span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring transition-smooth" />

                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-foreground">
                        Notify me when someone edits
                      </span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring transition-smooth" />

                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-foreground">
                        Notify me when someone comments
                      </span>
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring transition-smooth" />

                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>);

};

export default FileSharingInteractive;