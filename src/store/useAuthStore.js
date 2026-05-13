// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ADMIN_ACCOUNT = {
  id: 'admin-1',
  name: 'New User Admin',
  username: 'newuser007',
  password: 'vo\\1)£G2G.N8',
  role: 'admin',
  initials: 'NU'
};

export const DEMO_ACCOUNTS = [
  {
    ...ADMIN_ACCOUNT
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
