import type { Metadata } from 'next';
import MainDashboardInteractive from './components/MainDashboardInteractive';

export const metadata: Metadata = {
  title: 'My Drive - CloudDrive',
  description: 'Manage, organize, and access all your cloud storage files and folders in one centralized dashboard with comprehensive file operations and collaboration features.',
};

export default function MainDashboardPage() {
  return <MainDashboardInteractive />;
}