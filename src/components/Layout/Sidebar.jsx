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
    <aside className="m-5 mr-0 flex h-[calc(100vh-2.5rem)] w-32 shrink-0 flex-col rounded-[2rem] border border-cyan-200/40 bg-gradient-to-b from-cyan-950 via-teal-950 to-slate-950 px-4 py-6 text-white shadow-soft">
      <button className="mb-8 flex flex-col items-center gap-3 rounded-3xl p-2 transition hover:bg-white/10" onClick={() => onNavigate('dashboard')} title="Main menu">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-cyan-800 shadow-soft">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="text-center text-xs font-black uppercase leading-tight text-cyan-50">Productivity<br />Hub</div>
      </button>
      <nav className="flex flex-1 flex-col gap-3">
        {NAV_ITEMS.map((item) => {
          const Icon = icons[item.id];
          const active = activeModule === item.id;
          return (
            <button
              key={item.id}
              className={classNames(
                'group relative flex h-[4.85rem] flex-col items-center justify-center gap-1 rounded-2xl text-xs font-bold transition duration-300',
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
