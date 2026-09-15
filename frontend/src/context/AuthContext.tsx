import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { StorageService } from '../services/storage';

const STORAGE_KEY = 'quantumarena_user_session';
const TOKEN_KEY = 'codearena_jwt_token';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, username: string, email: string, password?: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  recordSolveActivity: () => void;
  useStreakFreeze: () => boolean;
  completeStreakRecovery: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => StorageService.getCurrentUser());

  const refreshUser = async () => {
    const current = StorageService.getCurrentUser();
    setUser(current);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (user) {
      StorageService.saveCurrentUser(user);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const users = StorageService.getUsers();
    let found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      // Determine role based on credentials
      const isAdmin = email.toLowerCase().includes('admin');
      found = {
        id: 'user_' + Math.random().toString(36).substr(2, 6),
        name: isAdmin ? 'Platform Administrator' : email.split('@')[0],
        username: email.split('@')[0],
        email: email,
        role: isAdmin ? 'admin' : 'user',
        rating: isAdmin ? 2400 : 1500,
        maxRating: isAdmin ? 2400 : 1500,
        rank: isAdmin ? 'Grandmaster' : 'Novice',
        solvedCount: { easy: 0, medium: 0, hard: 0, total: 0 },
        contestHistory: [],
        streak: 1,
        maxStreak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        streakFreezes: 2,
        streakStatus: 'active',
        activityHistory: [{ date: new Date().toISOString().split('T')[0], status: 'completed', count: 1 }],
        joinedDate: 'Just Now',
      };
      users.push(found);
      StorageService.saveUsers(users);
    }

    localStorage.setItem(TOKEN_KEY, 'mock-jwt-token-' + found.id);
    setUser(found);
    StorageService.saveCurrentUser(found);
    return true;
  };

  const register = async (
    name: string,
    username: string,
    email: string,
    password = 'user123'
  ): Promise<boolean> => {
    const users = StorageService.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase() || u.username === username);

    if (existing) {
      throw new Error('User with this email or username already exists');
    }

    const isAdmin = email.toLowerCase().includes('admin');
    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 6),
      name,
      username,
      email,
      role: isAdmin ? 'admin' : 'user',
      rating: 1500,
      maxRating: 1500,
      rank: 'Novice',
      solvedCount: { easy: 0, medium: 0, hard: 0, total: 0 },
      contestHistory: [],
      streak: 1,
      maxStreak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      streakFreezes: 2,
      streakStatus: 'active',
      activityHistory: [{ date: new Date().toISOString().split('T')[0], status: 'completed', count: 1 }],
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    users.push(newUser);
    StorageService.saveUsers(users);
    localStorage.setItem(TOKEN_KEY, 'mock-jwt-token-' + newUser.id);
    setUser(newUser);
    StorageService.saveCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const recordSolveActivity = () => {
    if (!user) return;
    const updated = StorageService.recordUserActivity(user);
    setUser(updated);
  };

  const useStreakFreeze = (): boolean => {
    if (!user || user.streakFreezes <= 0) return false;
    const updated = StorageService.useStreakFreezeToken(user);
    setUser(updated);
    return true;
  };

  const completeStreakRecovery = () => {
    if (!user) return;
    const updated = StorageService.completeStreakRecovery(user);
    setUser(updated);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    StorageService.saveCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        refreshUser,
        recordSolveActivity,
        useStreakFreeze,
        completeStreakRecovery,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
