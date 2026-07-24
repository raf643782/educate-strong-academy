import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'LEARNER' | 'COACH' | 'TUTOR' | 'ASSESSOR' | 'ADMIN';
  emailVerified: boolean;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  /** Re-fetches /auth/me so context state (e.g. emailVerified) reflects a change made without a full re-login, such as verifying an email. */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('es_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('es_token');
    if (storedToken) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data);
          setToken(storedToken);
        })
        .catch(() => {
          localStorage.removeItem('es_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('es_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('es_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    if (!localStorage.getItem('es_token')) return;
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch {
      // Leave existing state as-is — the global 401 interceptor already
      // handles a genuinely invalid/expired token.
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
