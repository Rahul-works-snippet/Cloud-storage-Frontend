import type { Metadata } from 'next';
import Sidebar from '@/components/common/Sidebar';
import TrashInteractive from './components/TrashInteractive';

export const metadata: Metadata = {
  title: 'Trash - CloudDrive',
  description: 'Manage deleted files and folders with restore capabilities and permanent deletion controls within the 30-day retention system.',
};

export default function TrashPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 lg:ml-60">
        <TrashInteractive />
      </div>
    </div>
  );
}