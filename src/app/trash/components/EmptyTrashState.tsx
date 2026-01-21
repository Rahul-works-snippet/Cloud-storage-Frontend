import Icon from '@/components/ui/AppIcon';

const EmptyTrashState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon name="TrashIcon" size={48} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
        Trash is Empty
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        Items you delete will appear here. You can restore them within 30 days before they are permanently deleted.
      </p>
    </div>
  );
};

export default EmptyTrashState;