# CloudDrive Frontend

A modern Next.js 15 cloud storage management application with intuitive file management, sharing, and search capabilities.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **File Management**: Upload, download, delete, and organize files in folders
- **File Sharing**: Share files and folders with other users or via public links
- **Search**: Full-text search across files and folders with recent searches
- **Favorites**: Star your favorite files and folders for quick access
- **Trash Management**: Soft delete with restore capability
- **Activity Tracking**: View your activity history
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time UI Updates**: Instant feedback on file operations
- **Drag & Drop**: Upload files by dragging and dropping

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Context API with React Hooks
- **Icons**: Heroicons, Lucide React
- **Charts**: Recharts for analytics
- **Form Handling**: Custom hooks for validation
- **Authentication**: JWT-based with localStorage

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:3001`

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_APP_NAME=CloudDrive
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:4028](http://localhost:4028) in your browser

## 📁 Project Structure

```
src/
├── app/                   # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── login/             # Login page
│   ├── main-dashboard/    # Main file dashboard
│   ├── file-sharing/      # Sharing management
│   └── search-results/    # Search results
├── components/            # UI components
├── contexts/              # Context providers
├── hooks/                 # Custom hooks
└── lib/                   # Utilities
```

## 🚀 Available Scripts

```bash
npm run dev      # Development server on port 4028
npm run build    # Build for production
npm start        # Start production
npm run lint     # Run linting
```

## 🔐 Authentication

JWT-based with token refresh and localStorage storage

## 🌐 API

Backend at `http://localhost:3001`
- Auth, Files, Folders, Shares, Search endpoints

## 🎨 Styling

Tailwind CSS with dark mode and responsive design

## 📄 License

MIT License

---

**Happy Coding! 🚀**

