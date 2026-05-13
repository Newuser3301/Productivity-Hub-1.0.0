// src/components/Pomodoro/Timer.jsx
import { useEffect } from 'react';
import { Coffee, Flame, Waves } from 'lucide-react';
import SessionCounter from './SessionCounter';
import TimerControls from './TimerControls';
import TimerSettings from './TimerSettings';
import { usePomodoroStore } from '../../store/usePomodoroStore';
import { useSound } from '../../hooks/useSound';
import { getTodayKey, minutesToLabel } from '../../utils/helpers';

const modeInfo = {
  focus: { label: 'Focus Time', color: '#ef4444', Icon: Flame },
  shortBreak: { label: 'Short Break', color: '#059669', Icon: Coffee },
  longBreak: { label: 'Long Break', color: '#2563eb', Icon: Waves }
};

export default function Timer() {
  const playSound = useSound();
  const settings = usePomodoroStore((state) => state.settings);
  const mode = usePomodoroStore((state) => state.mode);
  const secondsLeft = usePomodoroStore((state) => state.secondsLeft);
  const isRunning = usePomodoroStore((state) => state.isRunning);
  const tick = usePomodoroStore((state) => state.tick);
  const dailyFocus = usePomodoroStore((state) => state.dailyFocus);
  const switchMode = usePomodoroStore((state) => state.switchMode);
  const totalSeconds = mode === 'focus' ? settings.focusMinutes * 60 : mode === 'longBreak' ? settings.longBreakMinutes * 60 : settings.shortBreakMinutes * 60;
  const progress = 1 - secondsLeft / totalSeconds;
  const radius = 118;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const { label, color, Icon } = modeInfo[mode];

  useEffect(() => {
    if (!isRunning) return undefined;
    const interval = setInterval(() => {
      const timer = usePomodoroStore.getState();
      if (timer.isRunning && timer.secondsLeft <= 1) playSound();
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, playSound, tick]);

  useEffect(() => {
    const unsubscribe = window.electronAPI?.onPomodoroBeep?.(() => playSound());
    return () => unsubscribe?.();
  }, [playSound]);

  return (
    <div className="grid h-full grid-cols-[1fr_380px] gap-5">
      <section className="panel flex flex-col items-center justify-center gap-6 p-8">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white shadow-soft" style={{ background: color }}>
          <Icon className="h-4 w-4" /> {label}
        </div>
        <div className="relative h-72 w-72 rounded-full bg-white/42 p-2 shadow-inner backdrop-blur-xl dark:bg-slate-900/40">
          <svg viewBox="0 0 280 280" className="h-full w-full -rotate-90">
            <circle cx="140" cy="140" r={radius} stroke="currentColor" strokeWidth="16" fill="none" className="text-slate-200 dark:text-slate-800" />
            <circle cx="140" cy="140" r={radius} stroke={color} strokeWidth="16" strokeLinecap="round" fill="none" strokeDasharray={circumference} strokeDashoffset={dashOffset} className="transition-all duration-500" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-black tabular-nums tracking-tight">{minutesToLabel(secondsLeft)}</div>
            <SessionCounter />
          </div>
        </div>
        <TimerControls />
      </section>
      <aside className="flex min-h-0 flex-col gap-4">
        <TimerSettings />
        <div className="panel space-y-3 p-4">
          <h2 className="font-black">Mode</h2>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(modeInfo).map(([key, item]) => (
              <button key={key} className={`btn justify-start ${mode === key ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200'}`} onClick={() => switchMode(key)}>
                <item.Icon className="h-4 w-4" /> {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="panel p-4">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total focus time today</p>
          <p className="mt-2 text-4xl font-black">{dailyFocus[getTodayKey()] || 0} min</p>
        </div>
      </aside>
    </div>
  );
}
