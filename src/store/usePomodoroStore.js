// src/store/usePomodoroStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTodayKey } from '../utils/helpers';

const defaultSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4
};

const durationForMode = (mode, settings) => {
  if (mode === 'focus') return settings.focusMinutes * 60;
  if (mode === 'longBreak') return settings.longBreakMinutes * 60;
  return settings.shortBreakMinutes * 60;
};

export const usePomodoroStore = create(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      mode: 'focus',
      isRunning: false,
      secondsLeft: defaultSettings.focusMinutes * 60,
      completedFocusSessions: 0,
      dailyFocus: { [getTodayKey()]: 0 },
      setRunning: (isRunning) => {
        set({ isRunning });
        window.electronAPI?.pomodoroStatus?.({ isRunning, mode: get().mode, secondsLeft: get().secondsLeft });
      },
      reset: () => set((state) => ({ isRunning: false, secondsLeft: durationForMode(state.mode, state.settings) })),
      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings },
        secondsLeft: durationForMode(state.mode, { ...state.settings, ...settings })
      })),
      tick: () => set((state) => {
        if (!state.isRunning) return state;
        if (state.secondsLeft > 1) {
          const next = { secondsLeft: state.secondsLeft - 1 };
          window.electronAPI?.pomodoroStatus?.({ isRunning: true, mode: state.mode, secondsLeft: next.secondsLeft });
          return next;
        }
        const today = getTodayKey();
        const finishedFocus = state.mode === 'focus';
        const completedFocusSessions = finishedFocus ? state.completedFocusSessions + 1 : state.completedFocusSessions;
        const nextMode = finishedFocus
          ? (completedFocusSessions % state.settings.sessionsBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak')
          : 'focus';
        const nextSeconds = durationForMode(nextMode, state.settings);
        window.electronAPI?.notifySessionEnd?.({ mode: state.mode });
        window.electronAPI?.pomodoroStatus?.({ isRunning: true, mode: nextMode, secondsLeft: nextSeconds });
        return {
          mode: nextMode,
          secondsLeft: nextSeconds,
          completedFocusSessions,
          dailyFocus: {
            ...state.dailyFocus,
            [today]: (state.dailyFocus[today] || 0) + (finishedFocus ? state.settings.focusMinutes : 0)
          }
        };
      }),
      switchMode: (mode) => set((state) => ({ mode, isRunning: false, secondsLeft: durationForMode(mode, state.settings) }))
    }),
    { name: 'productivity-hub-pomodoro' }
  )
);
