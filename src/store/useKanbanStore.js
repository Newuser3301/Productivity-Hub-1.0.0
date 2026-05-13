// src/store/useKanbanStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uid } from '../utils/helpers';

const demoColumns = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      { id: 'card-1', title: 'Draft launch checklist', description: 'Capture dependencies, owners, and dates.', priority: 'high' },
      { id: 'card-2', title: 'Clean meeting notes', description: 'Summarize decisions into project records.', priority: 'medium' }
    ]
  },
  {
    id: 'progress',
    title: 'In Progress',
    cards: [
      { id: 'card-3', title: 'Build habit report', description: 'Create a concise weekly progress snapshot.', priority: 'medium' }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      { id: 'card-4', title: 'Set workspace theme', description: 'Dark mode and compact dashboard polish.', priority: 'low' }
    ]
  }
];

export const useKanbanStore = create(
  persist(
    (set) => ({
      columns: demoColumns,
      search: '',
      setSearch: (search) => set({ search }),
      addColumn: (title) => set((state) => ({ columns: [...state.columns, { id: uid('column'), title: title.trim(), cards: [] }] })),
      deleteColumn: (columnId) => set((state) => ({ columns: state.columns.filter((column) => column.id !== columnId) })),
      addCard: (columnId, card) => set((state) => ({
        columns: state.columns.map((column) => column.id === columnId
          ? { ...column, cards: [...column.cards, { id: uid('card'), ...card }] }
          : column)
      })),
      deleteCard: (columnId, cardId) => set((state) => ({
        columns: state.columns.map((column) => column.id === columnId
          ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) }
          : column)
      })),
      importMatrixTasks: (tasksByQuadrant) => set((state) => {
        const imported = Object.values(tasksByQuadrant).flat().filter((task) => !task.completed).map((task) => ({
          id: uid('card'),
          title: task.text,
          description: 'Imported from Eisenhower Matrix.',
          priority: 'medium'
        }));
        return {
          columns: state.columns.map((column) => column.id === 'todo' ? { ...column, cards: [...column.cards, ...imported] } : column)
        };
      }),
      reorder: (result) => set((state) => {
        const { source, destination, type } = result;
        if (!destination) return state;
        if (type === 'COLUMN') {
          const columns = Array.from(state.columns);
          const [moved] = columns.splice(source.index, 1);
          columns.splice(destination.index, 0, moved);
          return { columns };
        }
        const columns = state.columns.map((column) => ({ ...column, cards: Array.from(column.cards) }));
        const sourceColumn = columns.find((column) => column.id === source.droppableId);
        const destinationColumn = columns.find((column) => column.id === destination.droppableId);
        if (!sourceColumn || !destinationColumn) return state;
        const [moved] = sourceColumn.cards.splice(source.index, 1);
        destinationColumn.cards.splice(destination.index, 0, moved);
        return { columns };
      })
    }),
    { name: 'productivity-hub-kanban' }
  )
);
