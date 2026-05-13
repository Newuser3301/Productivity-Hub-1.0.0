// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEMO_ACCOUNTS = [
  {
    id: 'admin-1',
    name: 'Michael Admin',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    initials: 'MA'
  },
  {
    id: 'user-1',
    name: 'Productivity User',
    username: 'user',
    password: 'user123',
    role: 'user',
    initials: 'PU'
  }
];

export const useAuthStore = create(
  persist(
    (set) => ({
      currentUser: null,
      loginError: '',
      login: (username, password) => {
        const user = DEMO_ACCOUNTS.find((account) => account.username === username.trim() && account.password === password);
        if (!user) {
          set({ loginError: 'Username yoki parol notogri.' });
          return false;
        }
        const safeUser = {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          initials: user.initials
        };
        set({ currentUser: safeUser, loginError: '' });
        return true;
      },
      logout: () => set({ currentUser: null, loginError: '' }),
      clearError: () => set({ loginError: '' })
    }),
    {
      name: 'productivity-hub-auth'
    }
  )
);
