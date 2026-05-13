// src/store/useTimeBlockStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addWeeks, startOfWeek } from 'date-fns';
import { BLOCK_COLORS } from '../utils/constants';
import { getTodayKey, uid } from '../utils/helpers';

const today = getTodayKey();

export const useTimeBlockStore = create(
  persist(
    (set) => ({
      weekStart: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
      blocks: [
        { id: 'block-1', date: today, startHour: 9, duration: 2, title: 'Deep work', description: 'Build the highest-leverage feature first.', color: BLOCK_COLORS[1].value },
        { id: 'block-2', date: today, startHour: 14, duration: 1, title: 'Review inbox', description: 'Triage only, no rabbit holes.', color: BLOCK_COLORS[3].value }
      ],
      setWeek: (date) => set({ weekStart: startOfWeek(date, { weekStartsOn: 1 }).toISOString() }),
      shiftWeek: (amount) => set((state) => ({ weekStart: addWeeks(new Date(state.weekStart), amount).toISOString() })),
      addBlock: (block) => set((state) => ({ blocks: [...state.blocks, { ...block, id: uid('block') }] })),
      deleteBlock: (id) => set((state) => ({ blocks: state.blocks.filter((block) => block.id !== id) })),
      moveBlock: (id, date, startHour) => set((state) => ({
        blocks: state.blocks.map((block) => block.id === id ? { ...block, date, startHour } : block)
      })),
      resizeBlock: (id, duration) => set((state) => ({
        blocks: state.blocks.map((block) => block.id === id ? { ...block, duration } : block)
      }))
    }),
    { name: 'productivity-hub-time-blocks' }
  )
);
