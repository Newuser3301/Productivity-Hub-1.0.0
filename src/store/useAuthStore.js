// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const isFileProtocol = () => typeof window !== 'undefined' && window.location.protocol.startsWith('file');

const authenticateWithElectron = async (username, password) => {
  if (!window.electronAPI?.login) return null;
  return window.electronAPI.login({ username, password });
};

const authenticateWithServer = async (username, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'Username yoki parol notogri.');
  }
  return payload;
};

const logoutFromServer = async (token) => {
  if (!token || isFileProtocol()) return;
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).catch(() => undefined);
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      loginError: '',
      login: async (username, password) => {
        try {
          const credentials = { username: username.trim(), password };
          const result = await authenticateWithElectron(credentials.username, credentials.password)
            || await authenticateWithServer(credentials.username, credentials.password);
          set({ currentUser: result.user, loginError: '' });
          return true;
        } catch (error) {
          set({ loginError: error.message || 'Username yoki parol notogri.' });
          return false;
        }
      },
      logout: () => {
        const token = get().currentUser?.token;
        set({ currentUser: null, loginError: '' });
        logoutFromServer(token);
      },
      clearError: () => set({ loginError: '' })
    }),
    {
      name: 'productivity-hub-auth'
    }
  )
);
