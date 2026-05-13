// src/components/Pomodoro/TimerControls.jsx
import { Pause, Play, RotateCcw } from 'lucide-react';
import { usePomodoroStore } from '../../store/usePomodoroStore';

export default function TimerControls() {
  const isRunning = usePomodoroStore((state) => state.isRunning);
  const setRunning = usePomodoroStore((state) => state.setRunning);
  const reset = usePomodoroStore((state) => state.reset);

  return (
    <div className="flex justify-center gap-3">
      <button className="btn-primary min-w-32" onClick={() => setRunning(!isRunning)}>
        {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button className="btn-ghost" onClick={reset}><RotateCcw className="h-5 w-5" /> Reset</button>
    </div>
  );
}
