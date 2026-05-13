// src/components/Kanban/AddColumn.jsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useKanbanStore } from '../../store/useKanbanStore';

export default function AddColumn() {
  const [title, setTitle] = useState('');
  const addColumn = useKanbanStore((state) => state.addColumn);

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    addColumn(title);
    setTitle('');
  };

  return (
    <form onSubmit={submit} className="flex w-72 shrink-0 items-center gap-2 rounded-[1.4rem] border border-dashed border-cyan-300/80 bg-white/38 p-3 shadow-sm backdrop-blur-xl dark:border-cyan-900 dark:bg-slate-900/45">
      <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="New column" />
      <button className="icon-btn shrink-0" title="Add column"><Plus className="h-4 w-4" /></button>
    </form>
  );
}
