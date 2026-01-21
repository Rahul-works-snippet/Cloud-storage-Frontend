import Icon from '@/components/ui/AppIcon';

interface TrashBannerProps {
  retentionDays: number;
  itemCount: number;
}

const TrashBanner = ({ retentionDays, itemCount }: TrashBannerProps) => {
  return (
    <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Icon 
          name="ExclamationTriangleIcon" 
          size={24} 
          className="text-warning flex-shrink-0 mt-0.5" 
        />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Automatic Cleanup Policy
          </h3>
          <p className="text-sm text-muted-foreground">
            Items in trash are automatically deleted after {retentionDays} days. 
            You currently have {itemCount} {itemCount === 1 ? 'item' : 'items'} in trash.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrashBanner;