import { apiClient } from './api/client';
import type { Event } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const eventService = {
  async getAllEvents(params?: { type?: string; status?: string }) {
    let query = '';
    if (params) {
      const parts = [];
      if (params.type) parts.push(`type=${encodeURIComponent(params.type)}`);
      if (params.status) parts.push(`status=${encodeURIComponent(params.status)}`);
      if (parts.length > 0) query = '?' + parts.join('&');
    }
    const res = await apiClient.get<ApiResponse<Event[]>>(`/events${query}`);
    return res.data;
  },

  async getEventById(id: string) {
    const res = await apiClient.get<ApiResponse<Event>>(`/events/${id}`);
    return res.data;
  },

  async registerForEvent(id: string) {
    const res = await apiClient.post<{ success: boolean; message: string }>(`/events/${id}/register`, {});
    return res;
  },
};
