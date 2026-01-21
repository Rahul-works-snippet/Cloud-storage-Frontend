import type { Metadata } from 'next';
import FileSharingInteractive from './components/FileSharingInteractive';

export const metadata: Metadata = {
  title: 'File Sharing - CloudDrive',
  description: 'Securely share files and folders with granular permission controls. Manage access, set expiration dates, and generate public share links with password protection.',
};

export default function FileSharingPage() {
  return <FileSharingInteractive />;
}