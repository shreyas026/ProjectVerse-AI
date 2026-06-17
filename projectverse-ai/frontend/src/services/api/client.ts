const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api/v1';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 100000);

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: options.signal ?? controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Request timed out. The local AI model may still be generating; please try a shorter prompt.');
      }
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }

    if (response.status === 401) {
      // Try refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${this.baseUrl}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem('accessToken', data.data.tokens.accessToken);
            // Retry original request
            return this.request(endpoint, options);
          }
        } catch {
          // Fall through to logout
        }
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.error?.message || error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  put<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
