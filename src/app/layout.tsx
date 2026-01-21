import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import { Providers } from '@/providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'CloudDrive - Cloud Storage Service',
  description: 'Secure cloud storage with file sharing, collaboration, and advanced file management',
  keywords: ['cloud storage', 'file sharing', 'collaboration', 'security'],
  authors: [{ name: 'CloudDrive Team' }],
  openGraph: {
    title: 'CloudDrive',
    description: 'Secure cloud storage with file sharing',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
