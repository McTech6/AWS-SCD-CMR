// hooks/useAuth.ts - Auth management hook

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { login, logout, register, getMe, refreshToken } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'ATTENDEE' | 'SPEAKER';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const response = await login(email, password);
        
        if (response.success && response.data) {
          setUser(response.data);
          toast.success('Logged in successfully!');
          return true;
        }
        return false;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleRegister = useCallback(
    async (email: string, name: string, password: string) => {
      setLoading(true);
      try {
        const response = await register(email, name, password);
        
        if (response.success && response.data) {
          setUser(response.data);
          toast.success('Registered successfully!');
          return true;
        }
        return false;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      toast.error(message);
    }
  }, [router]);

  const fetchMe = useCallback(async () => {
    try {
      const response = await getMe();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      // Silently fail - user not authenticated
      setUser(null);
    }
  }, []);

  const refreshTokens = useCallback(async () => {
    try {
      const response = await refreshToken();
      if (response.success) {
        toast.success('Token refreshed');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Token refresh failed';
      toast.error(message);
    }
  }, []);

  return {
    user,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    fetchMe,
    refreshTokens,
  };
}
