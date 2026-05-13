// src/components/Kanban/Card.jsx
import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ChevronDown, Trash2 } from 'lucide-react';
import { useKanbanStore } from '../../store/useKanbanStore';
import { classNames } from '../../utils/helpers';

const priorityStyle = {
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
};

export default function Card({ card, index, columnId, dragDisabled = false }) {
  const [open, setOpen] = useState(false);
  const deleteCard = useKanbanStore((state) => state.deleteCard);

  return (
    <Draggable draggableId={card.id} index={index} isDragDisabled={dragDisabled}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classNames('group rounded-[1.15rem] border border-white/80 bg-white/80 p-3 shadow-sm backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:shadow-soft dark:border-white/10 dark:bg-slate-950/80', dragDisabled && 'cursor-default opacity-95', snapshot.isDragging && 'rotate-1 shadow-soft')}
        >
          <div className="flex items-start justify-between gap-2">
            <button className="min-w-0 flex-1 text-left" onClick={() => setOpen((value) => !value)}>
              <h3 className="break-words text-sm font-bold text-slate-900 dark:text-white">{card.title}</h3>
            </button>
            <button className="icon-btn h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => deleteCard(columnId, card.id)} title="Delete card">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className={classNames('rounded-full px-2 py-0.5 text-[11px] font-black uppercase', priorityStyle[card.priority])}>{card.priority}</span>
            <ChevronDown className={classNames('h-4 w-4 text-slate-400 transition', open && 'rotate-180')} />
          </div>
          {open && <p className="mt-3 rounded-xl bg-cyan-50/70 p-2 text-sm leading-6 text-slate-600 dark:bg-slate-900 dark:text-slate-300">{card.description || 'No description.'}</p>}
        </article>
      )}
    </Draggable>
  );
}
