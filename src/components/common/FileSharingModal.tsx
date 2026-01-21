'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FileSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName?: string;
  fileId?: string;
}

interface SharedUser {
  id: string;
  name: string;
  email: string;
  permission: 'view' | 'edit' | 'owner';
}

const FileSharingModal = ({
  isOpen,
  onClose,
  fileName = 'Untitled Document',
  fileId = '',
}: FileSharingModalProps) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [isPublicLink, setIsPublicLink] = useState(false);
  const [publicLinkUrl, setPublicLinkUrl] = useState('');
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      permission: 'owner',
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (isPublicLink) {
        setPublicLinkUrl(`https://clouddrive.app/share/${fileId || 'abc123xyz'}`);
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isPublicLink, fileId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      const newUser: SharedUser = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email: email.trim(),
        permission,
      };
      setSharedUsers([...sharedUsers, newUser]);
      setEmail('');
      setPermission('view');
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSharedUsers(sharedUsers.filter((user) => user.id !== userId));
  };

  const handlePermissionChange = (userId: string, newPermission: 'view' | 'edit') => {
    setSharedUsers(
      sharedUsers.map((user) =>
        user.id === userId ? { ...user, permission: newPermission } : user
      )
    );
  };

  const handleCopyLink = () => {
    if (publicLinkUrl) {
      navigator.clipboard.writeText(publicLinkUrl);
    }
  };

  const togglePublicLink = () => {
    setIsPublicLink(!isPublicLink);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[8vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card rounded-xl shadow-brand-2xl border border-border max-h-[84vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-heading font-semibold text-foreground truncate">
              Share "{fileName}"
            </h2>
            <p className="caption text-muted-foreground mt-1">
              Manage access and permissions
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-4 p-2 rounded-md hover:bg-muted transition-smooth"
            aria-label="Close modal"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Add People Form */}
          <form onSubmit={handleAddUser} className="mb-6">
            <label htmlFor="email-input" className="block text-sm font-medium text-foreground mb-2">
              Add people
            </label>
            <div className="flex gap-2">
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-smooth"
              />
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
                className="px-4 py-2.5 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-smooth"
              >
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
              </select>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:shadow-brand-lg active:scale-[0.97] transition-smooth"
              >
                Add
              </button>
            </div>
          </form>

          {/* Shared Users List */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">People with access</h3>
            <ul className="space-y-2">
              {sharedUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-md bg-muted border border-border"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <p className="caption text-muted-foreground truncate">{user.email}</p>
                  </div>
                  {user.permission === 'owner' ? (
                    <span className="caption text-muted-foreground px-3 py-1 bg-background rounded-md">
                      Owner
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select
                        value={user.permission}
                        onChange={(e) =>
                          handlePermissionChange(user.id, e.target.value as 'view' | 'edit')
                        }
                        className="px-3 py-1 bg-background border border-border rounded-md caption text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                      >
                        <option value="view">Can view</option>
                        <option value="edit">Can edit</option>
                      </select>
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="p-1.5 rounded-md hover:bg-background transition-smooth"
                        aria-label="Remove user"
                      >
                        <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Public Link Section */}
          <div className="pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-foreground">Public link</h3>
                <p className="caption text-muted-foreground mt-1">
                  Anyone with the link can view this file
                </p>
              </div>
              <button
                onClick={togglePublicLink}
                className={`
                  relative w-12 h-6 rounded-full transition-smooth
                  ${isPublicLink ? 'bg-primary' : 'bg-muted'}
                `}
                aria-label="Toggle public link"
              >
                <span
                  className={`
                    absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-brand transition-smooth
                    ${isPublicLink ? 'translate-x-6' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            {isPublicLink && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={publicLinkUrl}
                  readOnly
                  className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:shadow-brand-lg active:scale-[0.97] transition-smooth"
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 active:scale-[0.97] transition-smooth"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileSharingModal;