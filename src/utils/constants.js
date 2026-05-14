// src/utils/constants.js
export const QUADRANTS = [
  { id: 'do', title: 'Urgent & Important', subtitle: 'Do First', color: 'red', accent: 'border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/40' },
  { id: 'schedule', title: 'Not Urgent & Important', subtitle: 'Schedule', color: 'blue', accent: 'border-blue-300 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40' },
  { id: 'delegate', title: 'Urgent & Not Important', subtitle: 'Delegate', color: 'yellow', accent: 'border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40' },
  { id: 'eliminate', title: 'Not Urgent & Not Important', subtitle: 'Eliminate', color: 'green', accent: 'border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40' }
];

export const HOURS = Array.from({ length: 17 }, (_, index) => index + 6);

export const BLOCK_COLORS = [
  { name: 'Signal Red', value: '#dc2626' },
  { name: 'Ocean', value: '#2563eb' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Mint', value: '#059669' },
  { name: 'Violet', value: '#7c3aed' }
];

export const NAV_ITEMS = [
  { id: 'matrix', label: 'Matrix', shortcut: 'Ctrl+1' },
  { id: 'calendar', label: 'Schedule', shortcut: 'Ctrl+2' },
  { id: 'timer', label: 'Timer', shortcut: 'Ctrl+3' },
  { id: 'kanban', label: 'Kanban', shortcut: 'Ctrl+4' }
];

export const PRIORITIES = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

export const STORAGE_KEYS = {
  theme: 'productivity-hub-theme'
};
