// Re-export everything from the shared types package
// This file allows the web app to import from '@aicruzz/types'
// without needing a full npm workspace setup.
// When you set up npm workspaces, delete this file and install @aicruzz/types instead.

export type {
  User,
  UserPlan,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  Video,
  VideoType,
  VideoStyle,
  VideoResolution,
  VideoStatus,
  AspectRatio,
  GenerateVideoPayload,
  ApiKey,
  ApiError,
  PaginatedResponse,
} from '../../../packages/types/src/index';
