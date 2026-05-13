// src/App.jsx
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Bell, CheckCircle2, Clock3, Columns3, Layers3, LogOut, Plus, Search, Settings, Timer as TimerIcon, X } from 'lucide-react';
import Sidebar from './components/Layout/Sidebar';
import StatusBar from './components/Layout/StatusBar';
import ThemeToggle from './components/Layout/ThemeToggle';
import LoginPage from './components/Auth/LoginPage';
import Matrix from './components/Eisenhower/Matrix';
import Calendar from './components/TimeBlocking/Calendar';
import Timer from './components/Pomodoro/Timer';
import Board from './components/Kanban/Board';
import Home from './components/Dashboard/Home';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationsPanel, SearchPanel, SettingsPanel } from './components/Layout/ActionPanels';
import { usePomodoroStore } from './store/usePomodoroStore';
import { useEisenhowerStore } from './store/useEisenhowerStore';
import { useKanbanStore } from './store/useKanbanStore';
import { useTimeBlockStore } from './store/useTimeBlockStore';
import { useAuthStore } from './store/useAuthStore';
import { QUADRANTS, STORAGE_KEYS } from './utils/constants';
import { minutesToLabel } from './utils/helpers';
import { createDebouncedDatabaseSave, databaseKeys, loadDatabaseState } from './utils/databaseSync';

const moduleTitles = {
  dashboard: ['Main Menu', 'Your live productivity command center.'],
  matrix: ['Eisenhower Matrix', 'Prioritize the work that deserves your attention.'],
  calendar: ['Time Blocking', 'Shape the week before it shapes you.'],
  timer: ['Pomodoro Timer', 'Protect attention in focused rounds.'],
  kanban: ['Kanban Board', 'Track work from intent to done.']
};

export default function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickTaskText, setQuickTaskText] = useState('');
  const [quickTaskQuadrant, setQuickTaskQuadrant] = useState('do');
  const [activePanel, setActivePanel] = useState(null);
  const [now, setNow] = useState(new Date());
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(STORAGE_KEYS.theme) === 'dark');
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const ActiveComponent = useMemo(() => ({ dashboard: Home, matrix: Matrix, calendar: Calendar, timer: Timer, kanban: Board }[activeModule] || Home), [activeModule]);
  const [title, subtitle] = moduleTitles[activeModule];
  const matrixTasks = useEisenhowerStore((state) => state.tasks);
  const addMatrixTask = useEisenhowerStore((state) => state.addTask);
  const kanbanColumns = useKanbanStore((state) => state.columns);
  const timeBlocks = useTimeBlockStore((state) => state.blocks);
  const pomodoroRunning = usePomodoroStore((state) => state.isRunning);
  const pomodoroSeconds = usePomodoroStore((state) => state.secondsLeft);
  const openTasks = useMemo(() => Object.values(matrixTasks).flat().filter((task) => !task.completed).length, [matrixTasks]);
  const kanbanCards = useMemo(() => kanbanColumns.reduce((total, column) => total + column.cards.length, 0), [kanbanColumns]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(STORAGE_KEYS.theme, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.electronAPI?.onNavigate?.((module) => setActiveModule(module));
    window.electronAPI?.onQuickAdd?.(() => {
      setActiveModule('matrix');
      setQuickAddOpen(true);
    });
  }, []);

  useEffect(() => {
    if (!currentUser) return undefined;
    let hydrated = false;
    const debouncedSave = createDebouncedDatabaseSave();

    const hydrateFromDatabase = async () => {
      const state = await loadDatabaseState();
      if (state[databaseKeys.eisenhower]?.tasks) {
        useEisenhowerStore.setState({ tasks: state[databaseKeys.eisenhower].tasks });
      }
      if (state[databaseKeys.timeBlocks]?.blocks) {
        useTimeBlockStore.setState({
          blocks: state[databaseKeys.timeBlocks].blocks,
          weekStart: state[databaseKeys.timeBlocks].weekStart || useTimeBlockStore.getState().weekStart
        });
      }
      if (state[databaseKeys.pomodoro]?.settings) {
        usePomodoroStore.setState({
          settings: state[databaseKeys.pomodoro].settings,
          mode: state[databaseKeys.pomodoro].mode || 'focus',
          secondsLeft: state[databaseKeys.pomodoro].secondsLeft || state[databaseKeys.pomodoro].settings.focusMinutes * 60,
          completedFocusSessions: state[databaseKeys.pomodoro].completedFocusSessions || 0,
          dailyFocus: state[databaseKeys.pomodoro].dailyFocus || {}
        });
      }
      if (state[databaseKeys.kanban]?.columns) {
        useKanbanStore.setState({
          columns: state[databaseKeys.kanban].columns,
          search: ''
        });
      }
      hydrated = true;
    };

    hydrateFromDatabase();

    const unsubscribers = [
      useEisenhowerStore.subscribe((state) => {
        if (!hydrated) return;
        debouncedSave(databaseKeys.eisenhower, { tasks: state.tasks });
      }),
      useTimeBlockStore.subscribe((state) => {
        if (!hydrated) return;
        debouncedSave(databaseKeys.timeBlocks, { weekStart: state.weekStart, blocks: state.blocks });
      }),
      usePomodoroStore.subscribe((state) => {
        if (!hydrated) return;
        debouncedSave(databaseKeys.pomodoro, {
          settings: state.settings,
          mode: state.mode,
          secondsLeft: state.secondsLeft,
          completedFocusSessions: state.completedFocusSessions,
          dailyFocus: state.dailyFocus
        });
      }),
      useKanbanStore.subscribe((state) => {
        if (!hydrated) return;
        debouncedSave(databaseKeys.kanban, { columns: state.columns });
      })
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [currentUser]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey && ['1', '2', '3', '4'].includes(event.key)) {
        event.preventDefault();
        setActiveModule(['matrix', 'calendar', 'timer', 'kanban'][Number(event.key) - 1]);
      }
      if (event.ctrlKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        setActiveModule('matrix');
        setQuickAddOpen(true);
      }
      if (event.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        event.preventDefault();
        const pomodoro = usePomodoroStore.getState();
        pomodoro.setRunning(!pomodoro.isRunning);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const submitQuickTask = (event) => {
    event.preventDefault();
    if (!quickTaskText.trim()) return;
    addMatrixTask(quickTaskQuadrant, quickTaskText);
    setQuickTaskText('');
    setQuickAddOpen(false);
    setActiveModule('matrix');
  };

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen min-w-[320px] flex-col overflow-x-hidden p-0 pb-24 text-slate-950 dark:text-slate-100 lg:h-screen lg:flex-row lg:overflow-hidden lg:pb-0">
      <Sidebar activeModule={activeModule} onNavigate={setActiveModule} />
      <div className="m-3 flex min-w-0 flex-1 flex-col rounded-3xl border border-cyan-200/50 bg-white/42 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45 lg:m-5 lg:ml-4 lg:h-[calc(100vh-2.5rem)] lg:overflow-hidden lg:rounded-[2rem]">
        <header className="shrink-0 px-4 pb-4 pt-4 sm:px-5 lg:px-7 lg:pt-5">
          <div className="mb-4 flex flex-col gap-4 xl:mb-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="gradient-tile h-12 w-12 shrink-0 sm:h-14 sm:w-14">
                <Layers3 className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-cyan-700/70 dark:text-cyan-200/70">Dashboard</p>
                <h1 className="truncate text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">{title}</h1>
                <p className="truncate text-sm font-semibold text-slate-500 dark:text-slate-400">{subtitle}</p>
              </div>
            </div>
            <div className="flex justify-center xl:min-w-[360px] xl:flex-1 xl:px-4">
              <div className="rounded-[1.4rem] border border-white/70 bg-white/46 px-6 py-3 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/46">
                <p className="text-[11px] font-black uppercase text-cyan-700/70 dark:text-cyan-200/70">Live Time</p>
                <p className="mt-1 text-base font-black tabular-nums text-slate-900 dark:text-white sm:text-xl">{format(now, 'yyyy-MM-dd HH:mm:ss')}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 xl:justify-end">
              <button className="icon-btn" title="Search" onClick={() => setActivePanel('search')}><Search className="h-5 w-5" /></button>
              <button className="icon-btn" title="Notifications" onClick={() => setActivePanel('notifications')}><Bell className="h-5 w-5" /></button>
              <button className="icon-btn" title={currentUser.role === 'admin' ? 'Settings' : 'Settings are admin-only'} onClick={() => setActivePanel(currentUser.role === 'admin' ? 'settings' : 'notifications')}><Settings className="h-5 w-5" /></button>
              <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode((value) => !value)} />
              <div className="ml-0 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-3 py-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 xl:ml-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-900 text-sm font-black text-white">{currentUser.initials}</div>
                <div className="leading-tight">
                  <p className="text-sm font-black text-slate-800 dark:text-white">{currentUser.name}</p>
                  <p className="text-[11px] font-bold uppercase text-slate-400">{currentUser.role}</p>
                </div>
              </div>
              <button className="icon-btn" title="Logout" onClick={logout}><LogOut className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="stat-chip"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {openTasks} open tasks</span>
              <span className="stat-chip"><Clock3 className="h-4 w-4 text-cyan-600" /> {timeBlocks.length} time blocks</span>
              <span className="stat-chip"><TimerIcon className="h-4 w-4 text-red-500" /> {pomodoroRunning ? minutesToLabel(pomodoroSeconds) : 'Timer idle'}</span>
              <span className="stat-chip"><Columns3 className="h-4 w-4 text-violet-500" /> {kanbanCards} kanban cards</span>
            </div>
            <button className="btn-primary w-full sm:w-auto" onClick={() => { setActiveModule('matrix'); setQuickAddOpen(true); }} title="Quick add task">
              <Plus className="h-4 w-4" /> Quick Task
            </button>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-visible px-4 pb-5 transition-all duration-200 sm:px-5 lg:overflow-hidden lg:px-7">
          <ErrorBoundary name={title}>
            <ActiveComponent onNavigate={setActiveModule} onQuickTask={() => { setActiveModule('matrix'); setQuickAddOpen(true); }} />
          </ErrorBoundary>
        </main>
        <StatusBar />
      </div>
      {quickAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyan-950/35 p-6 backdrop-blur-sm">
          <form onSubmit={submitQuickTask} className="w-full max-w-lg rounded-[1.6rem] border border-white/75 bg-white/80 p-5 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/85">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-300">Ctrl+N</p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Quick Task</h2>
              </div>
              <button type="button" className="icon-btn" onClick={() => setQuickAddOpen(false)} title="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <input className="input" value={quickTaskText} onChange={(event) => setQuickTaskText(event.target.value)} placeholder="What needs your attention?" autoFocus />
              <select className="input" value={quickTaskQuadrant} onChange={(event) => setQuickTaskQuadrant(event.target.value)}>
                {QUADRANTS.map((item) => <option key={item.id} value={item.id}>{item.title} - {item.subtitle}</option>)}
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn-ghost" onClick={() => setQuickAddOpen(false)}>Cancel</button>
              <button className="btn-primary"><Plus className="h-4 w-4" /> Add Task</button>
            </div>
          </form>
        </div>
      )}
      {activePanel === 'search' && <SearchPanel onClose={() => setActivePanel(null)} onNavigate={setActiveModule} />}
      {activePanel === 'notifications' && <NotificationsPanel onClose={() => setActivePanel(null)} onNavigate={setActiveModule} />}
      {activePanel === 'settings' && currentUser.role === 'admin' && <SettingsPanel onClose={() => setActivePanel(null)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode((value) => !value)} />}
    </div>
  );
}
