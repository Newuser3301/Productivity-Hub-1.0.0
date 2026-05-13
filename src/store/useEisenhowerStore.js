// src/store/useEisenhowerStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uid } from '../utils/helpers';

const demoTasks = {
  do: [
    { id: 'matrix-1', text: 'Finish client proposal', completed: false },
    { id: 'matrix-2', text: 'Pay vendor invoice', completed: true }
  ],
  schedule: [
    { id: 'matrix-3', text: 'Plan quarterly goals', completed: false },
    { id: 'matrix-4', text: 'Book health checkup', completed: false }
  ],
  delegate: [
    { id: 'matrix-5', text: 'Ask teammate to compile metrics', completed: false }
  ],
  eliminate: [
    { id: 'matrix-6', text: 'Clear low-value newsletter backlog', completed: false }
  ]
};

export const useEisenhowerStore = create(
  persist(
    (set, get) => ({
      tasks: demoTasks,
      addTask: (quadrant, text) => set((state) => ({
        tasks: {
          ...state.tasks,
          [quadrant]: [{ id: uid('matrix'), text: text.trim(), completed: false }, ...(state.tasks[quadrant] || [])]
        }
      })),
      toggleTask: (quadrant, id) => set((state) => ({
        tasks: {
          ...state.tasks,
          [quadrant]: state.tasks[quadrant].map((task) => task.id === id ? { ...task, completed: !task.completed } : task)
        }
      })),
      deleteTask: (quadrant, id) => set((state) => ({
        tasks: {
          ...state.tasks,
          [quadrant]: state.tasks[quadrant].filter((task) => task.id !== id)
        }
      })),
      totalTasksToday: () => Object.values(get().tasks).flat().filter((task) => !task.completed).length
    }),
    { name: 'productivity-hub-eisenhower' }
  )
);
