// src/utils/helpers.js
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';

export const uid = (prefix = 'id') => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const getWeekDays = (date) => {
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
};

export const formatHour = (hour) => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalized}:00 ${suffix}`;
};

export const sameDateKey = (date) => format(date, 'yyyy-MM-dd');

export const isToday = (date) => isSameDay(date, new Date());

export const minutesToLabel = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

export const durationHoursToMinutes = (duration) => Math.max(1, Math.round(Number(duration || 0) * 60));

export const minutesToDurationLabel = (minutes) => {
  const normalizedMinutes = Math.max(1, Math.round(Number(minutes || 0)));
  const hours = Math.floor(normalizedMinutes / 60);
  const remainingMinutes = normalizedMinutes % 60;
  if (hours && remainingMinutes) return `${hours}h ${remainingMinutes}m`;
  if (hours) return `${hours}h`;
  return `${remainingMinutes}m`;
};

export const getTodayKey = () => format(new Date(), 'yyyy-MM-dd');

export const classNames = (...classes) => classes.filter(Boolean).join(' ');
