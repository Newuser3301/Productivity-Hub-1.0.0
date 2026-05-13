// src/components/Layout/Sidebar.jsx
import { CalendarDays, CheckSquare, Clock3, Grid2X2, Sparkles } from 'lucide-react';
import { NAV_ITEMS } from '../../utils/constants';
import { classNames } from '../../utils/helpers';

const icons = {
  matrix: Grid2X2,
  calendar: CalendarDays,
  timer: Clock3,
  kanban: CheckSquare
};

export default function Sidebar({ activeModule, onNavigate }) {
  return (
    <aside className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-2 rounded-3xl border border-cyan-200/40 bg-gradient-to-r from-cyan-950 via-teal-950 to-slate-950 p-2 text-white shadow-soft lg:static lg:m-5 lg:mr-0 lg:h-[calc(100vh-2.5rem)] lg:w-32 lg:shrink-0 lg:flex-col lg:bg-gradient-to-b lg:px-4 lg:py-6">
      <button className="hidden rounded-3xl p-2 transition hover:bg-white/10 lg:mb-8 lg:flex lg:flex-col lg:items-center lg:gap-3" onClick={() => onNavigate('dashboard')} title="Main menu">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-cyan-800 shadow-soft">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="text-center text-xs font-black uppercase leading-tight text-cyan-50">Productivity<br />Hub</div>
      </button>
      <button className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-cyan-800 shadow-soft lg:hidden" onClick={() => onNavigate('dashboard')} title="Main menu">
        <Sparkles className="h-5 w-5" />
      </button>
      <nav className="grid flex-1 grid-cols-4 gap-2 lg:flex lg:flex-col lg:gap-3">
        {NAV_ITEMS.map((item) => {
          const Icon = icons[item.id];
          const active = activeModule === item.id;
          return (
            <button
              key={item.id}
              className={classNames(
                'group relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-2xl text-[10px] font-bold transition duration-300 sm:text-xs lg:h-[4.85rem] lg:gap-1',
                active
                  ? 'bg-white text-cyan-950 shadow-soft'
                  : 'text-cyan-100/75 hover:bg-white/10 hover:text-white'
              )}
              title={`${item.label} (${item.shortcut})`}
              onClick={() => onNavigate(item.id)}
            >
              <span className={classNames('flex h-8 w-8 items-center justify-center rounded-xl transition', active ? 'bg-cyan-100 text-cyan-800' : 'bg-white/6 text-cyan-50 group-hover:bg-white/15')}>
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
