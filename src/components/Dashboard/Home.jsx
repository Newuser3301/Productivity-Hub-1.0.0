// src/components/Dashboard/Home.jsx
import { format } from 'date-fns';
import { CalendarDays, CheckCircle2, Grid2X2, Plus, Timer, Trello } from 'lucide-react';
import { useEisenhowerStore } from '../../store/useEisenhowerStore';
import { useKanbanStore } from '../../store/useKanbanStore';
import { usePomodoroStore } from '../../store/usePomodoroStore';
import { useTimeBlockStore } from '../../store/useTimeBlockStore';
import { getTodayKey, minutesToLabel } from '../../utils/helpers';

const cardMeta = [
  { id: 'matrix', title: 'Eisenhower Matrix', subtitle: 'Prioritize urgent and important tasks.', Icon: Grid2X2, tone: 'from-rose-400 to-red-500' },
  { id: 'calendar', title: 'Time Blocking', subtitle: 'Plan the week with draggable blocks.', Icon: CalendarDays, tone: 'from-sky-400 to-cyan-600' },
  { id: 'timer', title: 'Pomodoro Timer', subtitle: 'Run focus sessions with live status.', Icon: Timer, tone: 'from-emerald-400 to-teal-600' },
  { id: 'kanban', title: 'Kanban Board', subtitle: 'Track cards from idea to done.', Icon: Trello, tone: 'from-violet-400 to-indigo-600' }
];

export default function Home({ onNavigate, onQuickTask }) {
  const matrixTasks = useEisenhowerStore((state) => state.tasks);
  const columns = useKanbanStore((state) => state.columns);
  const blocks = useTimeBlockStore((state) => state.blocks);
  const pomodoroRunning = usePomodoroStore((state) => state.isRunning);
  const pomodoroSeconds = usePomodoroStore((state) => state.secondsLeft);
  const pomodoroMode = usePomodoroStore((state) => state.mode);
  const dailyFocus = usePomodoroStore((state) => state.dailyFocus);
  const openTasks = Object.values(matrixTasks).flat().filter((task) => !task.completed);
  const completedTasks = Object.values(matrixTasks).flat().filter((task) => task.completed);
  const cards = columns.flatMap((column) => column.cards.map((card) => ({ ...card, column: column.title })));
  const todayBlocks = blocks.filter((block) => block.date === getTodayKey()).sort((a, b) => a.startHour - b.startHour);

  return (
    <div className="grid h-full gap-5 overflow-visible lg:grid-cols-[1.4fr_0.9fr] lg:overflow-hidden">
      <section className="min-h-0 space-y-5 overflow-visible pr-0 lg:overflow-y-auto lg:pr-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cardMeta.map((item) => (
            <button key={item.id} onClick={() => onNavigate(item.id)} className="soft-card p-4 text-left">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone} text-white shadow-soft`}>
                <item.Icon className="h-6 w-6" />
              </div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">{item.title}</h2>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{item.subtitle}</p>
            </button>
          ))}
        </div>

        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Today Overview</h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
            </div>
            <button className="btn-primary" onClick={onQuickTask}><Plus className="h-4 w-4" /> Add Task</button>
          </div>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <div className="soft-card p-4"><p className="text-xs font-black uppercase text-slate-400">Open Tasks</p><p className="mt-2 text-3xl font-black">{openTasks.length}</p></div>
            <div className="soft-card p-4"><p className="text-xs font-black uppercase text-slate-400">Completed</p><p className="mt-2 text-3xl font-black">{completedTasks.length}</p></div>
            <div className="soft-card p-4"><p className="text-xs font-black uppercase text-slate-400">Today Blocks</p><p className="mt-2 text-3xl font-black">{todayBlocks.length}</p></div>
            <div className="soft-card p-4"><p className="text-xs font-black uppercase text-slate-400">Focus Today</p><p className="mt-2 text-3xl font-black">{dailyFocus[getTodayKey()] || 0}m</p></div>
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Next Time Blocks</h2>
            <button className="btn-ghost" onClick={() => onNavigate('calendar')}>Open Schedule</button>
          </div>
          <div className="space-y-3">
            {todayBlocks.slice(0, 4).map((block) => (
              <div key={block.id} className="soft-card flex items-center gap-3 p-3">
                <span className="h-10 w-2 rounded-full" style={{ background: block.color }} />
                <div className="min-w-0 flex-1">
                  <p className="font-black text-slate-900 dark:text-white">{block.title}</p>
                  <p className="text-sm font-semibold text-slate-500">{block.startHour}:00 - {block.startHour + block.duration}:00</p>
                </div>
              </div>
            ))}
            {!todayBlocks.length && <div className="rounded-2xl border border-dashed border-cyan-300/70 p-8 text-center text-sm font-bold text-slate-500">No time blocks today.</div>}
          </div>
        </div>
      </section>

      <aside className="flex min-h-0 flex-col gap-5 overflow-visible lg:overflow-y-auto">
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Pomodoro</h2>
            <button className="btn-ghost" onClick={() => onNavigate('timer')}>Open Timer</button>
          </div>
          <div className="rounded-[1.5rem] bg-cyan-950 p-5 text-white shadow-soft">
            <p className="text-xs font-black uppercase text-cyan-200">{pomodoroMode.replace(/([A-Z])/g, ' $1')}</p>
            <p className="mt-2 text-5xl font-black tabular-nums">{minutesToLabel(pomodoroSeconds)}</p>
            <p className="mt-2 text-sm font-bold text-cyan-100">{pomodoroRunning ? 'Running now' : 'Ready to start'}</p>
          </div>
        </div>

        <div className="panel min-h-0 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Active Work</h2>
            <button className="btn-ghost" onClick={() => onNavigate('kanban')}>Open Board</button>
          </div>
          <div className="space-y-3">
            {cards.slice(0, 6).map((card) => (
              <div key={card.id} className="soft-card p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-slate-900 dark:text-white">{card.title}</p>
                  <span className="rounded-full bg-white/70 px-2 py-1 text-[10px] font-black uppercase text-slate-500 dark:bg-slate-800">{card.priority}</span>
                </div>
                <p className="mt-1 text-xs font-bold text-slate-400">{card.column}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="mb-3 text-xl font-black">Matrix Pulse</h2>
          <div className="space-y-2">
            {openTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="flex items-center gap-2 rounded-2xl bg-white/55 p-3 text-sm font-bold dark:bg-slate-900/55">
                <CheckCircle2 className="h-4 w-4 text-cyan-600" /> {task.text}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
