import axios from 'axios';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/refresh`,
            { refreshToken }
          );

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  logout: (refreshToken: string) => api.post('/api/auth/logout', { refreshToken }),
  
  getMe: () => api.get('/api/auth/me'),
  
  refresh: (refreshToken: string) =>
    api.post('/api/auth/refresh', { refreshToken }),
};

export const workspaceApi = {
  getAll: () => api.get('/api/workspaces'),
  
  getById: (id: string) => api.get(`/api/workspaces/${id}`),
  
  create: (data: { name: string; description?: string }) =>
    api.post('/api/workspaces', data),
  
  update: (id: string, data: { name?: string; description?: string }) =>
    api.patch(`/api/workspaces/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/workspaces/${id}`),
  
  invite: (id: string, data: { email: string; role: string }) =>
    api.post(`/api/workspaces/${id}/invite`, data),
  
  getMembers: (id: string) => api.get(`/api/workspaces/${id}/members`),
};

export default api;
