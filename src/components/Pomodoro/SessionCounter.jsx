// src/components/Pomodoro/SessionCounter.jsx
import { usePomodoroStore } from '../../store/usePomodoroStore';

export default function SessionCounter() {
  const completedFocusSessions = usePomodoroStore((state) => state.completedFocusSessions);
  const sessionsBeforeLongBreak = usePomodoroStore((state) => state.settings.sessionsBeforeLongBreak);
  const current = (completedFocusSessions % sessionsBeforeLongBreak) + 1;
  return <p className="text-sm font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Session {current}/{sessionsBeforeLongBreak}</p>;
}
