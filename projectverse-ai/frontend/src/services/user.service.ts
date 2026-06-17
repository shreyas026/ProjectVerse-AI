import { apiClient } from './api/client';
import type { User, LeaderboardEntry } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const userService = {
  async getLeaderboard() {
    const res = await apiClient.get<ApiResponse<LeaderboardEntry[]>>('/users/leaderboard/top');
    return res.data;
  },

  async getUserById(id: string) {
    const res = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return res.data;
  },

  async getUserProjects(id: string) {
    const res = await apiClient.get<ApiResponse<any[]>>(`/users/${id}/projects`);
    return res.data;
  },

  async searchUsers(query: string) {
    const res = await apiClient.get<ApiResponse<User[]>>(`/users/search/query?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
