'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/authStore';
import { useRouter, usePathname } from 'next/navigation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Disabled for now - causing refresh loop
  // useEffect(() => {
  //   // Fetch user on mount
  //   fetchUser();
  // }, [fetchUser]);

  const publicRoutes = ['/login', '/register', '/shares/link'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Show loading state
  if (isLoading && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
