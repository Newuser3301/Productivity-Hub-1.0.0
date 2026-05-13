// src/components/Kanban/SearchFilter.jsx
import { Search } from 'lucide-react';
import { useKanbanStore } from '../../store/useKanbanStore';

export default function SearchFilter() {
  const search = useKanbanStore((state) => state.search);
  const setSearch = useKanbanStore((state) => state.setSearch);

  return (
    <label className="relative block w-full md:min-w-80">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input className="input pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search cards..." />
    </label>
  );
}
