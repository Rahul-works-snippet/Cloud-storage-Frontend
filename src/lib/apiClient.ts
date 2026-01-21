import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          this.refreshToken().catch(() => {
            // Redirect to login if refresh fails
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          });
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string, name: string) {
    return this.client.post('/auth/register', { email, password, name });
  }

  async login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  async logout() {
    return this.client.post('/auth/logout');
  }

  async getMe() {
    return this.client.get('/auth/me');
  }

  async refreshToken() {
    return this.client.post('/auth/refresh');
  }

  // Folder endpoints
  async createFolder(name: string, parentId?: string) {
    return this.client.post('/folders', { name, parentId });
  }

  async getFolder(folderId: string) {
    return this.client.get(`/folders/${folderId}`);
  }

  async getRootFolders() {
    return this.client.get('/folders/root');
  }

  async updateFolder(folderId: string, updates: { name?: string; parentId?: string | null }) {
    return this.client.patch(`/folders/${folderId}`, updates);
  }

  async deleteFolder(folderId: string) {
    return this.client.delete(`/folders/${folderId}`);
  }

  async getFolderBreadcrumb(folderId: string) {
    return this.client.get(`/folders/${folderId}/breadcrumb`);
  }

  // File endpoints
  async initiateUpload(name: string, mimeType: string, sizeBytes: number, folderId?: string) {
    return this.client.post('/files/init', { name, mimeType, sizeBytes, folderId });
  }

  async completeUpload(fileId: string, checksum?: string) {
    return this.client.post('/files/complete', { fileId, checksum });
  }

  async getFile(fileId: string) {
    return this.client.get(`/files/${fileId}`);
  }

  async updateFile(fileId: string, updates: { name?: string; folderId?: string | null }) {
    return this.client.patch(`/files/${fileId}`, updates);
  }

  async deleteFile(fileId: string) {
    return this.client.delete(`/files/${fileId}`);
  }

  async getFileVersions(fileId: string) {
    return this.client.get(`/files/${fileId}/versions`);
  }

  async getTrash(limit?: number, offset?: number) {
    return this.client.get('/files/trash', { params: { limit, offset } });
  }

  async restoreFile(fileId: string) {
    return this.client.post(`/files/${fileId}/restore`);
  }

  // Share endpoints
  async grantShare(resourceType: 'file' | 'folder', resourceId: string, granteeUserId: string, role: 'viewer' | 'editor') {
    return this.client.post('/shares', { resourceType, resourceId, granteeUserId, role });
  }

  async getShares(resourceType: 'file' | 'folder', resourceId: string) {
    return this.client.get(`/shares/${resourceType}/${resourceId}`);
  }

  async revokeShare(shareId: string) {
    return this.client.delete(`/shares/${shareId}`);
  }

  async createLinkShare(resourceType: 'file' | 'folder', resourceId: string, expiresAt?: string, password?: string) {
    return this.client.post('/shares/links', { resourceType, resourceId, expiresAt, password });
  }

  async resolveLinkShare(token: string, password?: string) {
    return this.client.get(`/shares/links/${token}`, { params: { password } });
  }

  async deleteLinkShare(linkShareId: string) {
    return this.client.delete(`/shares/links/${linkShareId}`);
  }

  // Search endpoints
  async search(q?: string, type?: 'file' | 'folder', limit?: number, offset?: number) {
    return this.client.get('/search', { params: { q, type, limit, offset } });
  }

  async getRecent(limit?: number) {
    return this.client.get('/search/recent', { params: { limit } });
  }

  async addStar(resourceType: 'file' | 'folder', resourceId: string) {
    return this.client.post('/search/stars', { resourceType, resourceId });
  }

  async removeStar(resourceType: 'file' | 'folder', resourceId: string) {
    return this.client.delete('/search/stars', { data: { resourceType, resourceId } });
  }

  async getStars() {
    return this.client.get('/search/stars');
  }

  // Direct file upload to storage
  async uploadToStorage(uploadUrl: string, file: File, onProgress?: (progress: number) => void) {
    const config = {
      onUploadProgress: (progressEvent: any) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    };

    return axios.put(uploadUrl, file, config);
  }
}

export const apiClient = new ApiClient();
