'use client';

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  if (!items || items.length === 0) return null;

  const displayItems = items.length > 3 ? [items[0], { label: '...', path: '' }, ...items.slice(-2)] : items;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 ${className}`}>
      <ol className="flex items-center gap-2 flex-wrap">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <Icon
                  name="ChevronRightIcon"
                  size={16}
                  className="text-muted-foreground flex-shrink-0"
                />
              )}
              {isEllipsis ? (
                <span className="text-sm text-muted-foreground px-2">...</span>
              ) : isLast ? (
                <span className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="text-sm text-muted-foreground hover:text-foreground transition-smooth truncate max-w-[150px] sm:max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;