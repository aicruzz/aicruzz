// ─── User ───────────────────────────────────────────────────────────────────

export type UserPlan = 'free' | 'starter' | 'pro' | 'studio';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  plan: UserPlan;
  credits_used: number;
  credits_limit: number;
  created_at: string;
  updated_at: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// ─── Video ───────────────────────────────────────────────────────────────────

export type VideoType = 'text_to_video' | 'avatar' | 'animation' | 'transform';
export type VideoStyle = 'cinematic' | 'cartoon' | 'anime' | 'realistic' | 'pixar';
export type VideoResolution = '720p' | '1080p' | '2k' | '4k';
export type VideoStatus = 'queued' | 'processing' | 'done' | 'failed';
export type AspectRatio = '16:9' | '9:16' | '1:1';

export interface Video {
  id: string;
  user_id: string;
  title: string;
  type: VideoType;
  prompt?: string;
  style?: VideoStyle;
  duration?: number;
  resolution?: VideoResolution;
  status: VideoStatus;
  url?: string | null;
  thumbnail_url?: string | null;
  file_size?: number | null;
  created_at: string;
}

export interface GenerateVideoPayload {
  prompt: string;
  style: VideoStyle;
  duration: number;
  resolution: VideoResolution;
  aspect_ratio: AspectRatio;
  voice_narration?: boolean;
  auto_captions?: boolean;
}

// ─── API Key ─────────────────────────────────────────────────────────────────

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  environment: 'live' | 'test';
  last_used_at?: string | null;
  request_count: number;
  is_active: boolean;
  created_at: string;
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
