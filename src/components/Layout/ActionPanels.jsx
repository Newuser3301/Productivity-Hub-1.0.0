// src/components/Layout/ActionPanels.jsx
import { Bell, CalendarDays, CheckCircle2, Clock3, Grid2X2, Search, Settings, Timer, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useEisenhowerStore } from '../../store/useEisenhowerStore';
import { useKanbanStore } from '../../store/useKanbanStore';
import { usePomodoroStore } from '../../store/usePomodoroStore';
import { useTimeBlockStore } from '../../store/useTimeBlockStore';
import { getTodayKey, minutesToLabel } from '../../utils/helpers';

const PanelShell = ({ title, icon: Icon, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-cyan-950/30 p-3 pt-8 backdrop-blur-sm sm:p-6 sm:pt-24">
    <section className="w-full max-w-2xl rounded-[1.6rem] border border-white/75 bg-white/85 p-4 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/88 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="gradient-tile h-11 w-11"><Icon className="h-5 w-5" /></div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{title}</h2>
        </div>
        <button className="icon-btn" onClick={onClose} title="Close"><X className="h-5 w-5" /></button>
      </div>
      {children}
    </section>
  </div>
);

export function SearchPanel({ onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const matrixTasks = useEisenhowerStore((state) => state.tasks);
  const blocks = useTimeBlockStore((state) => state.blocks);
  const columns = useKanbanStore((state) => state.columns);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const modules = [
      { id: 'dashboard', title: 'Main Dashboard', type: 'Module', icon: Grid2X2 },
      { id: 'matrix', title: 'Eisenhower Matrix', type: 'Module', icon: Grid2X2 },
      { id: 'calendar', title: 'Time Blocking', type: 'Module', icon: CalendarDays },
      { id: 'timer', title: 'Pomodoro Timer', type: 'Module', icon: Timer },
      { id: 'kanban', title: 'Kanban Board', type: 'Module', icon: CheckCircle2 }
    ];
    const taskResults = Object.values(matrixTasks).flat().map((task) => ({ id: task.id, title: task.text, type: 'Matrix task', target: 'matrix', icon: CheckCircle2 }));
    const blockResults = blocks.map((block) => ({ id: block.id, title: `${block.title} - ${block.date} ${block.startHour}:00`, type: 'Time block', target: 'calendar', icon: Clock3 }));
    const cardResults = columns.flatMap((column) => column.cards.map((card) => ({ id: card.id, title: `${card.title} - ${column.title}`, type: 'Kanban card', target: 'kanban', icon: CheckCircle2 })));
    return [...modules.map((item) => ({ ...item, target: item.id })), ...taskResults, ...blockResults, ...cardResults]
      .filter((item) => !q || `${item.title} ${item.type}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [blocks, columns, matrixTasks, query]);

  return (
    <PanelShell title="Search" icon={Search} onClose={onClose}>
      <input className="input mb-4" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search modules, tasks, cards, time blocks..." autoFocus />
      <div className="max-h-[50vh] space-y-2 overflow-y-auto">
        {results.map((item) => (
          <button key={`${item.type}-${item.id}`} className="soft-card flex w-full items-center gap-3 p-3 text-left" onClick={() => { onNavigate(item.target); onClose(); }}>
            <item.icon className="h-5 w-5 text-cyan-700" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-black text-slate-900 dark:text-white">{item.title}</span>
              <span className="text-xs font-bold text-slate-400">{item.type}</span>
            </span>
          </button>
        ))}
      </div>
    </PanelShell>
  );
}

export function NotificationsPanel({ onClose, onNavigate }) {
  const matrixTasks = useEisenhowerStore((state) => state.tasks);
  const blocks = useTimeBlockStore((state) => state.blocks);
  const pomodoroRunning = usePomodoroStore((state) => state.isRunning);
  const pomodoroSeconds = usePomodoroStore((state) => state.secondsLeft);
  const openTasks = Object.values(matrixTasks).flat().filter((task) => !task.completed);
  const todayBlocks = blocks.filter((block) => block.date === getTodayKey());
  const notifications = [
    { id: 'tasks', title: `${openTasks.length} open matrix tasks`, body: openTasks.length ? 'Review priority tasks before planning more work.' : 'All matrix tasks are clear.', target: 'matrix' },
    { id: 'blocks', title: `${todayBlocks.length} time blocks today`, body: todayBlocks.length ? 'Your schedule has planned work for today.' : 'No blocks today. Add one from Schedule.', target: 'calendar' },
    { id: 'timer', title: pomodoroRunning ? `Pomodoro running: ${minutesToLabel(pomodoroSeconds)}` : 'Pomodoro idle', body: pomodoroRunning ? 'Focus session is active.' : 'Start a focus session when ready.', target: 'timer' }
  ];

  return (
    <PanelShell title="Notifications" icon={Bell} onClose={onClose}>
      <div className="space-y-3">
        {notifications.map((item) => (
          <button key={item.id} className="soft-card w-full p-4 text-left" onClick={() => { onNavigate(item.target); onClose(); }}>
            <p className="font-black text-slate-900 dark:text-white">{item.title}</p>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{item.body}</p>
          </button>
        ))}
      </div>
    </PanelShell>
  );
}

export function SettingsPanel({ onClose, darkMode, onToggleDarkMode }) {
  const settings = usePomodoroStore((state) => state.settings);
  const updateSettings = usePomodoroStore((state) => state.updateSettings);
  const setSearch = useKanbanStore((state) => state.setSearch);

  return (
    <PanelShell title="Settings" icon={Settings} onClose={onClose}>
      <div className="space-y-4">
        <div className="soft-card flex items-center justify-between p-4">
          <div>
            <p className="font-black text-slate-900 dark:text-white">Dark Mode</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Switch the whole dashboard theme.</p>
          </div>
          <button className="btn-primary" onClick={onToggleDarkMode}>{darkMode ? 'Light' : 'Dark'}</button>
        </div>
        <div className="soft-card p-4">
          <p className="mb-3 font-black text-slate-900 dark:text-white">Pomodoro Defaults</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['focusMinutes', 'Focus'],
              ['shortBreakMinutes', 'Short'],
              ['longBreakMinutes', 'Long'],
              ['sessionsBeforeLongBreak', 'Rounds']
            ].map(([key, label]) => (
              <label key={key} className="text-xs font-black uppercase text-slate-400">
                {label}
                <input className="input mt-1" type="number" min="1" value={settings[key]} onChange={(event) => updateSettings({ [key]: Math.max(1, Number(event.target.value)) })} />
              </label>
            ))}
          </div>
        </div>
        <button className="btn-ghost w-full justify-center" onClick={() => setSearch('')}>
          <Trash2 className="h-4 w-4" /> Clear Kanban Search Filter
        </button>
      </div>
    </PanelShell>
  );
}
