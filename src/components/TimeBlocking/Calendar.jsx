// src/components/TimeBlocking/Calendar.jsx
import { format } from 'date-fns';
import BlockModal from './BlockModal';
import TimeSlot from './TimeSlot';
import WeekNavigation from './WeekNavigation';
import { HOURS } from '../../utils/constants';
import { formatHour, getWeekDays, isToday, sameDateKey } from '../../utils/helpers';
import { useState } from 'react';
import { useTimeBlockStore } from '../../store/useTimeBlockStore';

export default function Calendar() {
  const [slot, setSlot] = useState(null);
  const weekStartValue = useTimeBlockStore((state) => state.weekStart);
  const blocks = useTimeBlockStore((state) => state.blocks);
  const addBlock = useTimeBlockStore((state) => state.addBlock);
  const moveBlock = useTimeBlockStore((state) => state.moveBlock);
  const weekStart = new Date(weekStartValue);
  const days = getWeekDays(weekStart);

  const findBlock = (dateKey, hour) => blocks.find((block) => block.date === dateKey && hour >= block.startHour && hour < block.startHour + block.duration);
  const save = (block) => {
    addBlock(block);
    setSlot(null);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <WeekNavigation />
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Click any empty cell to plan work. On mobile, swipe horizontally.</div>
      </div>
      <div className="panel min-h-0 flex-1 overflow-auto">
        <div className="grid min-w-[920px] grid-cols-[72px_repeat(7,minmax(118px,1fr))] lg:min-w-[1050px] lg:grid-cols-[88px_repeat(7,minmax(130px,1fr))]">
          <div className="sticky top-0 z-20 border-b border-r border-white/70 bg-white/70 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70" />
          {days.map((day) => (
            <div key={day.toISOString()} className={`sticky top-0 z-20 border-b border-r border-white/70 p-3 text-center backdrop-blur-xl dark:border-white/10 ${isToday(day) ? 'bg-cyan-100/70 dark:bg-cyan-950/35' : 'bg-white/70 dark:bg-slate-950/70'}`}>
              <p className="text-xs font-black uppercase text-slate-400">{format(day, 'EEE')}</p>
              <p className="font-black text-slate-900 dark:text-white">{format(day, 'MMM d')}</p>
            </div>
          ))}
          {HOURS.map((hour) => (
            <div key={hour} className="contents">
              <div className="sticky left-0 z-10 flex min-h-16 items-start justify-end border-b border-r border-white/70 bg-white/70 p-2 text-xs font-bold text-slate-400 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">{formatHour(hour)}</div>
              {days.map((day) => {
                const dateKey = sameDateKey(day);
                return <TimeSlot key={`${dateKey}-${hour}`} dateKey={dateKey} hour={hour} block={findBlock(dateKey, hour)} onEmptyClick={(date, selectedHour) => setSlot({ date, hour: selectedHour })} onMoveBlock={moveBlock} />;
              })}
            </div>
          ))}
        </div>
      </div>
      <BlockModal slot={slot} onClose={() => setSlot(null)} onSave={save} />
    </div>
  );
}
