import Icon from '@/components/ui/AppIcon';

interface SharedUser {
  id: string;
  name: string;
  email: string;
  permission: 'viewer' | 'editor' | 'owner';
  accessDate: string;
  avatar: string;
  avatarAlt: string;
}

interface SharedUsersListProps {
  users: SharedUser[];
  onPermissionChange: (userId: string, permission: 'viewer' | 'editor') => void;
  onRevokeAccess: (userId: string) => void;
  onSetExpiry: (userId: string) => void;
}

const SharedUsersList = ({
  users,
  onPermissionChange,
  onRevokeAccess,
  onSetExpiry,
}: SharedUsersListProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">
        People with access ({users.length})
      </h3>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border"
          >
            {/* User Avatar */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.name}
              </p>
              <p className="caption text-muted-foreground truncate">
                {user.email}
              </p>
              <p className="caption text-muted-foreground mt-0.5">
                Access granted: {user.accessDate}
              </p>
            </div>

            {/* Permission Controls */}
            {user.permission === 'owner' ? (
              <span className="caption text-muted-foreground px-3 py-1.5 bg-background rounded-md border border-border">
                Owner
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={user.permission}
                  onChange={(e) =>
                    onPermissionChange(
                      user.id,
                      e.target.value as 'viewer' | 'editor'
                    )
                  }
                  className="px-3 py-1.5 bg-background border border-border rounded-md caption text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                  aria-label={`Change permission for ${user.name}`}
                >
                  <option value="viewer">Can view</option>
                  <option value="editor">Can edit</option>
                </select>

                {/* More Options Menu */}
                <div className="relative group">
                  <button
                    className="p-1.5 rounded-md hover:bg-background transition-smooth"
                    aria-label="More options"
                  >
                    <Icon
                      name="EllipsisVerticalIcon"
                      size={16}
                      className="text-muted-foreground"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-brand-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth z-50">
                    <button
                      onClick={() => onSetExpiry(user.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth text-left"
                    >
                      <Icon
                        name="ClockIcon"
                        size={16}
                        className="text-muted-foreground"
                      />
                      Set expiry date
                    </button>
                    <button
                      onClick={() => onRevokeAccess(user.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-smooth text-left"
                    >
                      <Icon
                        name="XMarkIcon"
                        size={16}
                        className="text-destructive"
                      />
                      Revoke access
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SharedUsersList;