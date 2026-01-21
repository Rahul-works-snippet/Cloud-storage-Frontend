'use client';

import { useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface UploadZoneProps {
  onFilesSelected: (files: FileList) => void;
}

const UploadZone = ({ onFilesSelected }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFilePicker}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-smooth
          ${
            isDragging
              ? 'border-primary bg-primary/5 shadow-brand-lg'
              : 'border-border bg-muted/50 hover:border-primary/50 hover:bg-muted'
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className={`
              w-16 h-16 rounded-full flex items-center justify-center transition-smooth
              ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}
            `}
          >
            <Icon name="CloudArrowUpIcon" size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="caption text-muted-foreground">
              or click to browse from your computer
            </p>
          </div>
          <p className="caption text-muted-foreground">
            Maximum file size: 100 MB
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="File upload input"
      />
    </>
  );
};

export default UploadZone;