import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface FileCardProps {
  fileName: string;
  fileType: string;
  fileSize: string;
  thumbnail: string;
  thumbnailAlt: string;
  lastModified: string;
  isSelected: boolean;
  onSelect: () => void;
}

const FileCard = ({
  fileName,
  fileType,
  fileSize,
  thumbnail,
  thumbnailAlt,
  lastModified,
  isSelected,
  onSelect,
}: FileCardProps) => {
  const getFileIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      pdf: 'DocumentTextIcon',
      doc: 'DocumentIcon',
      docx: 'DocumentIcon',
      xls: 'TableCellsIcon',
      xlsx: 'TableCellsIcon',
      ppt: 'PresentationChartBarIcon',
      pptx: 'PresentationChartBarIcon',
      zip: 'ArchiveBoxIcon',
      image: 'PhotoIcon',
      video: 'VideoCameraIcon',
      audio: 'MusicalNoteIcon',
    };
    return iconMap[type.toLowerCase()] || 'DocumentIcon';
  };

  const isImageFile = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(
    fileType.toLowerCase()
  );

  return (
    <div
      className={`
        relative p-4 rounded-lg border transition-smooth cursor-pointer
        ${
          isSelected
            ? 'border-primary bg-primary/5 shadow-brand'
            : 'border-border bg-card hover:border-primary/50 hover:shadow-brand-sm'
        }
      `}
      onClick={onSelect}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 right-3 z-10">
        <div
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center transition-smooth
            ${
              isSelected
                ? 'bg-primary border-primary' :'bg-card border-muted-foreground/30'
            }
          `}
        >
          {isSelected && (
            <Icon
              name="CheckIcon"
              size={14}
              className="text-primary-foreground"
            />
          )}
        </div>
      </div>

      {/* File Preview */}
      <div className="mb-3 aspect-square rounded-md overflow-hidden bg-muted flex items-center justify-center">
        {isImageFile ? (
          <AppImage
            src={thumbnail}
            alt={thumbnailAlt}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon
            name={getFileIcon(fileType) as any}
            size={48}
            className="text-muted-foreground"
          />
        )}
      </div>

      {/* File Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground truncate" title={fileName}>
          {fileName}
        </h3>
        <div className="flex items-center justify-between">
          <span className="caption text-muted-foreground uppercase">
            {fileType}
          </span>
          <span className="caption text-muted-foreground">{fileSize}</span>
        </div>
        <p className="caption text-muted-foreground">{lastModified}</p>
      </div>
    </div>
  );
};

export default FileCard;