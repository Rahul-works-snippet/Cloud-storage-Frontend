import type { Metadata } from 'next';
import SearchResultsInteractive from './components/SearchResultsInteractive';

export const metadata: Metadata = {
  title: 'Search Results - CloudDrive',
  description: 'Find and discover files and folders across your cloud storage with advanced filtering, sorting, and search capabilities.',
};

export default function SearchResultsPage() {
  return <SearchResultsInteractive />;
}