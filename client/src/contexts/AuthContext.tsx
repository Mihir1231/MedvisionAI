import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'medvision_users';
const CURRENT_USER_KEY = 'medvision_current_user';

/*API Backend*/
const API_URL = "http://localhost:5000/api/auth";


const initializeUsers = () => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    const adminUser: User & { password: string } = {
      id: 'admin-001',
      name: 'System Admin',
      email: 'admin@medvision.ai',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([adminUser]));
    return [adminUser];
  }
  return JSON.parse(stored);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeUsers();
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  /*Login*/
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {

    
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const foundUser = users.find((u: User & { password: string }) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      if (foundUser.isBlocked) {
        return { success: false, error: 'Your account has been blocked. Please contact support.' };
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return { success: true };
    }

    
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message };

      setUser(data.user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      return { success: true };
    } catch {
      return { success: false, error: "Server error" };
    }
  };

  /* Register */
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {

    
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');

    if (users.some((u: User) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }

    
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message };

      setUser(data.user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      return { success: true };
    } catch {
      return { success: false, error: "Server error" };
    }
  };

  /* Logout*/
  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem("token");
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
