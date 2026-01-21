import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

// Folders
export function useFolderContents(folderId: string) {
  return useQuery({
    queryKey: ['folder', folderId],
    queryFn: () => apiClient.getFolder(folderId).then((res) => res.data),
    enabled: !!folderId,
  });
}

export function useRootFolders() {
  return useQuery({
    queryKey: ['folders', 'root'],
    queryFn: () => apiClient.getRootFolders().then((res) => res.data),
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; parentId?: string }) =>
      apiClient.createFolder(data.name, data.parentId).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['folder', variables.parentId] });
      queryClient.invalidateQueries({ queryKey: ['folders', 'root'] });
    },
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { folderId: string; updates: { name?: string; parentId?: string | null } }) =>
      apiClient.updateFolder(data.folderId, data.updates).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['folder', variables.folderId] });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (folderId: string) => apiClient.deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

// Files
export function useFile(fileId: string) {
  return useQuery({
    queryKey: ['file', fileId],
    queryFn: () => apiClient.getFile(fileId).then((res) => res.data),
    enabled: !!fileId,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; mimeType: string; sizeBytes: number; folderId?: string; file: File }) => {
      const initResponse = await apiClient.initiateUpload(data.name, data.mimeType, data.sizeBytes, data.folderId);
      const { fileId, uploadUrl } = initResponse.data;

      await apiClient.uploadToStorage(uploadUrl, data.file);

      const completeResponse = await apiClient.completeUpload(fileId);
      return completeResponse.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['folder', variables.folderId] });
      queryClient.invalidateQueries({ queryKey: ['folders', 'root'] });
    },
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { fileId: string; updates: { name?: string; folderId?: string | null } }) =>
      apiClient.updateFile(data.fileId, data.updates).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['file', variables.fileId] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => apiClient.deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useTrash() {
  return useQuery({
    queryKey: ['trash'],
    queryFn: () => apiClient.getTrash(20, 0).then((res) => res.data),
  });
}

export function useRestoreFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => apiClient.restoreFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

// Search & Stars
export function useSearch(query?: string, type?: 'file' | 'folder') {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: () => apiClient.search(query, type).then((res) => res.data),
    enabled: !!query,
  });
}

export function useRecent() {
  return useQuery({
    queryKey: ['search', 'recent'],
    queryFn: () => apiClient.getRecent(10).then((res) => res.data),
  });
}

export function useAddStar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { resourceType: 'file' | 'folder'; resourceId: string }) =>
      apiClient.addStar(data.resourceType, data.resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search', 'stars'] });
    },
  });
}

export function useRemoveStar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { resourceType: 'file' | 'folder'; resourceId: string }) =>
      apiClient.removeStar(data.resourceType, data.resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search', 'stars'] });
    },
  });
}

export function useStars() {
  return useQuery({
    queryKey: ['search', 'stars'],
    queryFn: () => apiClient.getStars().then((res) => res.data),
  });
}

// Sharing
export function useCreateShare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { resourceType: 'file' | 'folder'; resourceId: string; granteeUserId: string; role: 'viewer' | 'editor' }) =>
      apiClient.grantShare(data.resourceType, data.resourceId, data.granteeUserId, data.role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shares'] });
    },
  });
}

export function useCreateLinkShare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { resourceType: 'file' | 'folder'; resourceId: string; expiresAt?: string; password?: string }) =>
      apiClient.createLinkShare(data.resourceType, data.resourceId, data.expiresAt, data.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shares'] });
    },
  });
}

export function useGetShares(resourceType: 'file' | 'folder', resourceId: string) {
  return useQuery({
    queryKey: ['shares', resourceType, resourceId],
    queryFn: () => apiClient.getShares(resourceType, resourceId).then((res) => res.data),
    enabled: !!resourceId,
  });
}
