// src/components/TimeBlocking/WeekNavigation.jsx
import { addDays, format } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useTimeBlockStore } from '../../store/useTimeBlockStore';

export default function WeekNavigation() {
  const weekStartValue = useTimeBlockStore((state) => state.weekStart);
  const shiftWeek = useTimeBlockStore((state) => state.shiftWeek);
  const setWeek = useTimeBlockStore((state) => state.setWeek);
  const weekStart = new Date(weekStartValue);
  const weekEnd = addDays(weekStart, 6);

  return (
    <div className="flex items-center gap-2">
      <button className="icon-btn" onClick={() => shiftWeek(-1)} title="Previous week"><ChevronLeft className="h-5 w-5" /></button>
      <button className="btn-ghost min-w-72" onClick={() => setWeek(new Date())} title="Go to current week">
        <CalendarDays className="h-4 w-4" />
        {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
      </button>
      <button className="icon-btn" onClick={() => shiftWeek(1)} title="Next week"><ChevronRight className="h-5 w-5" /></button>
    </div>
  );
}
