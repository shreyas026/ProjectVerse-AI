import { apiClient } from './api/client';

/**
 * Auth Service - handles login, register, and session management
 * Communicates with backend /api/v1/auth endpoints
 */

interface LoginResponse {
  success: boolean;
  data: {
    user: { id: string; email: string; firstName: string; lastName: string; role: string; avatar?: string };
    tokens: { accessToken: string; refreshToken: string };
  };
}

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  college?: { name: string; department: string; yearOfStudy: number };
}

export const authService = {
  async login(email: string, password: string) {
    const res = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('accessToken', res.data.tokens.accessToken);
      localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res;
  },

  async register(payload: RegisterPayload) {
    const res = await apiClient.post<LoginResponse>('/auth/register', payload);
    if (res.success) {
      localStorage.setItem('accessToken', res.data.tokens.accessToken);
      localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res;
  },

  async getMe() {
    return apiClient.get<{ success: boolean; data: { user: any } }>('/auth/me');
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
