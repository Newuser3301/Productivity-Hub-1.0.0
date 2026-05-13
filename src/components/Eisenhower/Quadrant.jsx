// src/components/Eisenhower/Quadrant.jsx
import { Trash2 } from 'lucide-react';
import { classNames } from '../../utils/helpers';
import { useEisenhowerStore } from '../../store/useEisenhowerStore';

export default function Quadrant({ quadrant, tasks }) {
  const toggleTask = useEisenhowerStore((state) => state.toggleTask);
  const deleteTask = useEisenhowerStore((state) => state.deleteTask);

  return (
    <section className={classNames('flex min-h-0 flex-col rounded-[1.5rem] border p-4 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-soft', quadrant.accent)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-black text-slate-950 dark:text-white">{quadrant.title}</h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{quadrant.subtitle}</p>
        </div>
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black text-slate-700 shadow-sm backdrop-blur-xl dark:bg-slate-900/80 dark:text-slate-200">{tasks.length}</span>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <div key={task.id} className="group flex items-center gap-3 rounded-2xl border border-white/80 bg-white/80 p-3 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/95 dark:border-white/10 dark:bg-slate-900/80">
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(quadrant.id, task.id)} className="h-4 w-4 rounded border-slate-300" />
            <span className={classNames('min-w-0 flex-1 text-sm font-medium', task.completed && 'text-slate-400 line-through')}>{task.text}</span>
            <button className="icon-btn h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => deleteTask(quadrant.id, task.id)} title="Delete task">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {!tasks.length && <div className="rounded-2xl border border-dashed border-cyan-300/70 bg-white/35 p-6 text-center text-sm font-bold text-slate-500 dark:border-cyan-900 dark:bg-slate-900/35">No tasks here.</div>}
      </div>
    </section>
  );
}
