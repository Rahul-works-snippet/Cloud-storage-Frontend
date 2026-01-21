import Icon from '@/components/ui/AppIcon';

interface TrashStatsProps {
  totalSize: string;
  itemCount: number;
  recoveredToday: number;
}

const TrashStats = ({ totalSize, itemCount, recoveredToday }: TrashStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-destructive/10 flex items-center justify-center">
            <Icon name="TrashIcon" size={20} className="text-destructive" />
          </div>
          <div>
            <p className="caption text-muted-foreground">Items in Trash</p>
            <p className="text-xl font-semibold text-foreground">{itemCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-warning/10 flex items-center justify-center">
            <Icon name="CircleStackIcon" size={20} className="text-warning" />
          </div>
          <div>
            <p className="caption text-muted-foreground">Storage Used</p>
            <p className="text-xl font-semibold text-foreground">{totalSize}</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-success/10 flex items-center justify-center">
            <Icon name="ArrowPathIcon" size={20} className="text-success" />
          </div>
          <div>
            <p className="caption text-muted-foreground">Recovered Today</p>
            <p className="text-xl font-semibold text-foreground">{recoveredToday}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrashStats;