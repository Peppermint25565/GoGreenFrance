
import React, { createContext, useContext, useEffect, useState } from 'react';
import { uploadAvatar } from '@/utils/uploadToSupabase';
import { addProfile, getRole, getAvatar, getName } from '../api/Profile'
import { supabase } from '@/supabase';
import { Session } from '@supabase/supabase-js';

export type UserRole = 0 | 1 | 2;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, avatarFile?: File | null) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cached = localStorage.getItem("user");
  const [user, setUser] = useState<User | null>(
    cached ? JSON.parse(cached) : null
  );
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_ev, newSession) => {
      setSession(newSession)
    })
    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: await getName(data.user.email),
        role: await getRole(data.user.email),
        avatar: await getAvatar(data.user.email),
      } as User);
      if (error) throw error
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    avatarFile?: File | null
  ) => {
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({ email, password })
      console.log(error)
      if (error) throw error
      let photoURL: string | undefined = undefined;

      if (avatarFile) {
        photoURL = await uploadAvatar(data.user.id, avatarFile);
      }
      await addProfile({uuid: data.user.id, avatar: photoURL, name: name, role: role as number});
      setUser({
        id: data.user.id,
        email: email,
        name: name,
        role,
        avatar: photoURL,
      } as User);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
