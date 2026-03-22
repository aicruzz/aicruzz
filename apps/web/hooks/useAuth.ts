'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { setToken, getToken, removeToken } from '@/lib/auth';
import type { User, LoginPayload, RegisterPayload } from '@aicruzz/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // On mount, attempt to fetch current user if token exists
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    authApi
      .me()
      .then((user) => setState({ user, loading: false, error: null }))
      .catch(() => {
        removeToken();
        setState({ user: null, loading: false, error: null });
      });
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { token, user } = await authApi.login(payload);
      setToken(token);
      setState({ user, loading: false, error: null });
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Please check your credentials.';
      setState((s) => ({ ...s, loading: false, error: msg }));
    }
  }, [router]);

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { token, user } = await authApi.register(payload);
      setToken(token);
      setState({ user, loading: false, error: null });
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed. Please try again.';
      setState((s) => ({ ...s, loading: false, error: msg }));
    }
  }, [router]);

  const logout = useCallback(() => {
    removeToken();
    setState({ user: null, loading: false, error: null });
    router.push('/login');
  }, [router]);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isLoggedIn: !!state.user,
    login,
    register,
    logout,
  };
}
