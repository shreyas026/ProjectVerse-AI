import { apiClient } from './api/client';
import type { Project } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export const projectService = {
  async getAllProjects(params?: { category?: string; status?: string; search?: string; page?: number; limit?: number }) {
    let query = '';
    if (params) {
      const parts = [];
      if (params.category && params.category !== 'All') parts.push(`category=${encodeURIComponent(params.category)}`);
      if (params.status) parts.push(`status=${encodeURIComponent(params.status)}`);
      if (params.search) parts.push(`search=${encodeURIComponent(params.search)}`);
      if (params.page) parts.push(`page=${params.page}`);
      if (params.limit) parts.push(`limit=${params.limit}`);
      if (parts.length > 0) query = '?' + parts.join('&');
    }
    const res = await apiClient.get<ApiResponse<Project[]>>(`/projects${query}`);
    return res.data;
  },

  async getProjectById(id: string) {
    const res = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    return res.data;
  },

  async createProject(payload: Partial<Project>) {
    const res = await apiClient.post<ApiResponse<Project>>('/projects', payload);
    return res.data;
  },

  async likeProject(id: string) {
    const res = await apiClient.post<ApiResponse<{ likes: number; liked: boolean }>>(`/projects/${id}/like`, {});
    return res.data;
  },
};
