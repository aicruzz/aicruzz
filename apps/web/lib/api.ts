import axios from 'axios';
import { getToken, removeToken } from './auth';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
  Video,
  PaginatedResponse,
  GenerateVideoPayload,
  ApiKey,
} from '@aicruzz/types';

// ── Axios instance ────────────────────────────────────────────
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear token and redirect to login
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await http.post<AuthResponse>('/api/v1/auth/register', payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await http.post<AuthResponse>('/api/v1/auth/login', payload);
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await http.get<{ user: User }>('/api/v1/auth/me');
    return data.user;
  },

  updateMe: async (payload: Partial<Pick<User, 'name' | 'avatar_url'>>): Promise<User> => {
    const { data } = await http.patch<{ user: User }>('/api/v1/auth/me', payload);
    return data.user;
  },
};

// ── Videos ───────────────────────────────────────────────────
export const videosApi = {
  list: async (page = 1, limit = 20): Promise<PaginatedResponse<Video>> => {
    const { data } = await http.get<PaginatedResponse<Video>>('/api/v1/videos', {
      params: { page, limit },
    });
    return data;
  },

  get: async (id: string): Promise<Video> => {
    const { data } = await http.get<Video>(`/api/v1/videos/${id}`);
    return data;
  },

  generate: async (payload: GenerateVideoPayload): Promise<Video> => {
    const { data } = await http.post('/api/v1/videos/generate', payload);
    return data;
  },

  getStatus: async (id: string): Promise<Pick<Video, 'id' | 'status' | 'url'>> => {
    const { data } = await http.get(`/api/v1/videos/${id}/status`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/api/v1/videos/${id}`);
  },
};

// ── API Keys ─────────────────────────────────────────────────
export const apiKeysApi = {
  list: async (): Promise<ApiKey[]> => {
    const { data } = await http.get<ApiKey[]>('/api/v1/keys');
    return data;
  },
  create: async (name: string): Promise<{ key: ApiKey; raw_key: string }> => {
    const { data } = await http.post('/api/v1/keys', { name });
    return data;
  },
  revoke: async (id: string): Promise<void> => {
    await http.delete(`/api/v1/keys/${id}`);
  },
};

export default http;
