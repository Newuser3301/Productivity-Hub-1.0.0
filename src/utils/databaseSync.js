// src/utils/databaseSync.js
export const databaseKeys = {
  eisenhower: 'eisenhower',
  timeBlocks: 'timeBlocks',
  pomodoro: 'pomodoro',
  kanban: 'kanban'
};

const canUseServerApi = () => typeof window !== 'undefined' && !window.location.protocol.startsWith('file');

export const loadDatabaseState = async () => {
  if (!canUseServerApi()) return {};
  try {
    const response = await fetch('/api/state', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Database load failed: ${response.status}`);
    const data = await response.json();
    return Object.fromEntries(Object.entries(data.state || {}).map(([key, entry]) => [key, entry.value]));
  } catch (error) {
    console.warn(error.message);
    return {};
  }
};

export const saveDatabaseState = async (key, value) => {
  if (!canUseServerApi()) return;
  try {
    await fetch(`/api/state/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value })
    });
  } catch (error) {
    console.warn(`Database save failed for ${key}: ${error.message}`);
  }
};

export const createDebouncedDatabaseSave = (delay = 450) => {
  const timers = new Map();
  return (key, value) => {
    window.clearTimeout(timers.get(key));
    timers.set(key, window.setTimeout(() => saveDatabaseState(key, value), delay));
  };
};
