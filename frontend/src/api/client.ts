import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = useAuthStore.getState().refreshToken;
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refresh}` },
        });
        useAuthStore.getState().setAuth(
          useAuthStore.getState().user!,
          data.access_token,
          refresh!
        );
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (d: any) => api.post('/auth/register', d),
  login: (d: any) => api.post('/auth/login', d),
  me: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (d: any) => api.post('/auth/reset-password', d),
};

// ── Students ──────────────────────────────────────────────────────────────────
export const studentApi = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (d: any) => api.put('/students/profile', d),
  uploadAvatar: (f: File) => { const fd = new FormData(); fd.append('file', f); return api.post('/students/profile/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  uploadResume: (f: File) => { const fd = new FormData(); fd.append('file', f); return api.post('/students/profile/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  getAchievements: () => api.get('/students/achievements'),
  createAchievement: (d: any) => api.post('/students/achievements', d),
  deleteAchievement: (id: string) => api.delete(`/students/achievements/${id}`),
  uploadAchievementFile: (id: string, f: File, type: string) => { const fd = new FormData(); fd.append('file', f); return api.post(`/students/achievements/${id}/upload?file_type=${type}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  getScores: () => api.get('/students/scores'),
  getLeaderboard: (limit = 20) => api.get(`/students/leaderboard?limit=${limit}`),
  getPublicProfile: (id: string) => api.get(`/students/${id}/public`),
};

// ── Projects ──────────────────────────────────────────────────────────────────
export const projectApi = {
  list: (params?: any) => api.get('/projects/', { params }),
  create: (d: any) => api.post('/projects/', d),
  get: (id: string) => api.get(`/projects/${id}`),
  update: (id: string, d: any) => api.put(`/projects/${id}`, d),
  delete: (id: string) => api.delete(`/projects/${id}`),
  myProjects: () => api.get('/projects/my/projects'),
  createShowcase: (projectId: string, d: any) => api.post(`/projects/${projectId}/showcase`, d),
};

// ── Showcases ─────────────────────────────────────────────────────────────────
export const showcaseApi = {
  list: (params?: any) => api.get('/showcases/', { params }),
  get: (id: string) => api.get(`/showcases/${id}`),
  like: (id: string) => api.post(`/showcases/${id}/like`),
};

// ── AI ────────────────────────────────────────────────────────────────────────
export const aiApi = {
  chat: (d: any) => api.post('/ai/chat', d),
  validateProject: (d: any) => api.post('/ai/validate-project', d),
  improveProject: (id: string) => api.post(`/ai/improve-project/${id}`),
  qualityCheck: (d: FormData | { github_url: string }) => {
    if (d instanceof FormData) return api.post('/ai/quality-check', d, { headers: { 'Content-Type': 'multipart/form-data' } });
    return api.post('/ai/quality-check', null, { params: d });
  },
  originalityCheck: (d: FormData | { text: string }) => {
    if (d instanceof FormData) return api.post('/ai/originality-check', d, { headers: { 'Content-Type': 'multipart/form-data' } });
    return api.post('/ai/originality-check', null, { params: d });
  },
  analyzeAchievements: () => api.post('/ai/analyze-achievements'),
  matchTeam: (teamId: string) => api.post(`/ai/match-team/${teamId}`),
};

// ── Teams ─────────────────────────────────────────────────────────────────────
export const teamApi = {
  list: (params?: any) => api.get('/teams/', { params }),
  create: (d: any) => api.post('/teams/', d),
  get: (id: string) => api.get(`/teams/${id}`),
  myTeams: () => api.get('/teams/my'),
  apply: (id: string, msg: string) => api.post(`/teams/${id}/apply?message=${encodeURIComponent(msg)}`),
  getRequests: (id: string) => api.get(`/teams/${id}/requests`),
  acceptRequest: (tid: string, rid: string) => api.post(`/teams/${tid}/requests/${rid}/accept`),
  rejectRequest: (tid: string, rid: string) => api.post(`/teams/${tid}/requests/${rid}/reject`),
  getTasks: (id: string) => api.get(`/teams/${id}/tasks`),
  createTask: (id: string, d: any) => api.post(`/teams/${id}/tasks`, d),
  updateTaskStatus: (tid: string, taskId: string, status: string) => api.patch(`/teams/${tid}/tasks/${taskId}/status?status=${status}`),
  deleteTask: (tid: string, taskId: string) => api.delete(`/teams/${tid}/tasks/${taskId}`),
  getMessages: (id: string) => api.get(`/teams/${id}/messages`),
  getContributions: (id: string) => api.get(`/teams/${id}/contributions`),
};

// ── Faculty ───────────────────────────────────────────────────────────────────
export const facultyApi = {
  getProfile: () => api.get('/faculty/profile'),
  updateProfile: (d: any) => api.put('/faculty/profile', d),
  listProjects: (params?: any) => api.get('/faculty/projects', { params }),
  analyzeClass: (projectIds: string[]) => api.post('/faculty/analyze-class', projectIds),
  getReviews: () => api.get('/faculty/reviews'),
  getStudents: () => api.get('/faculty/students'),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  listUsers: (params?: any) => api.get('/admin/users', { params }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  listProjects: (params?: any) => api.get('/admin/projects', { params }),
  deleteProject: (id: string) => api.delete(`/admin/projects/${id}`),
  getLeaderboard: () => api.get('/admin/leaderboard'),
};
