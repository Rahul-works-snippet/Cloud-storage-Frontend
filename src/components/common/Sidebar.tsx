'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface SidebarProps {
  isCollapsed?: boolean;
}

const Sidebar = ({ isCollapsed = false }: SidebarProps) => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'My Drive',
      path: '/main-dashboard',
      icon: 'FolderIcon',
      tooltip: 'Access your files and folders',
    },
    {
      label: 'Search',
      path: '/search-results',
      icon: 'MagnifyingGlassIcon',
      tooltip: 'Search across all files',
    },
    {
      label: 'Trash',
      path: '/trash',
      icon: 'TrashIcon',
      tooltip: 'Manage deleted files',
    },
  ];

  const isActive = (path: string) => pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-[150] p-2 rounded-md bg-card shadow-brand transition-smooth hover:shadow-brand-lg"
        aria-label="Toggle navigation menu"
      >
        <Icon name={isMobileOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background z-[110]"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-card border-r border-border z-[120]
          transition-smooth shadow-brand-lg
          ${isCollapsed ? 'w-20' : 'w-60'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center h-16 px-4 border-b border-border">
            <Link href="/main-dashboard" className="flex items-center gap-3 transition-smooth hover:opacity-80">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <path
                    d="M3 8L12 3L21 8V16L12 21L3 16V8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-foreground"
                  />
                  <path
                    d="M12 3V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-primary-foreground"
                  />
                  <path
                    d="M3 8L21 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-primary-foreground"
                  />
                  <path
                    d="M21 8L3 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-primary-foreground"
                  />
                </svg>
              </div>
              {!isCollapsed && (
                <span className="font-heading text-xl font-semibold text-foreground">
                  CloudDrive
                </span>
              )}
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-md
                      transition-smooth group relative
                      ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-foreground shadow-brand'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                    title={isCollapsed ? item.tooltip : undefined}
                  >
                    <Icon
                      name={item.icon as any}
                      size={20}
                      className="flex-shrink-0"
                    />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                    {isCollapsed && (
                      <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-brand-lg opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Section */}
          <div className="px-4 py-4 border-t border-border">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Icon name="UserIcon" size={18} className="text-muted-foreground" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">User Account</p>
                  <p className="text-xs text-muted-foreground truncate">user@example.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;