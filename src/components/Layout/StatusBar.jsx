// src/components/Layout/StatusBar.jsx
import { format } from 'date-fns';
import { CheckCircle2, Clock3, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEisenhowerStore } from '../../store/useEisenhowerStore';
import { usePomodoroStore } from '../../store/usePomodoroStore';
import { minutesToLabel } from '../../utils/helpers';

export default function StatusBar() {
  const [now, setNow] = useState(new Date());
  const totalTasksToday = useEisenhowerStore((state) => state.totalTasksToday);
  const isRunning = usePomodoroStore((state) => state.isRunning);
  const mode = usePomodoroStore((state) => state.mode);
  const secondsLeft = usePomodoroStore((state) => state.secondsLeft);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="mx-4 mb-4 flex shrink-0 flex-col items-center justify-between gap-2 rounded-2xl border border-white/70 bg-white/48 px-4 py-3 text-xs font-black text-slate-500 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/48 dark:text-slate-400 sm:flex-row lg:mx-7 lg:h-10 lg:py-0">
      <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" />{format(now, 'yyyy-MM-dd · HH:mm:ss')}</span>
      <span className="inline-flex items-center gap-2"><Timer className="h-4 w-4" />{isRunning ? `${mode.replace(/([A-Z])/g, ' $1')} · ${minutesToLabel(secondsLeft)}` : 'Pomodoro idle'}</span>
      <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />{totalTasksToday()} open matrix tasks</span>
    </footer>
  );
}
