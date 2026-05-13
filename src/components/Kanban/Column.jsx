// src/components/Kanban/Column.jsx
import { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Plus, Trash2 } from 'lucide-react';
import Card from './Card';
import { PRIORITIES } from '../../utils/constants';
import { useKanbanStore } from '../../store/useKanbanStore';
import { classNames } from '../../utils/helpers';

export default function Column({ column, index, search }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const addCard = useKanbanStore((state) => state.addCard);
  const deleteColumn = useKanbanStore((state) => state.deleteColumn);
  const filteredCards = column.cards.filter((card) => `${card.title} ${card.description}`.toLowerCase().includes(search.toLowerCase()));

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    addCard(column.id, { title: title.trim(), description: description.trim(), priority });
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <section ref={provided.innerRef} {...provided.draggableProps} className="flex max-h-full w-80 shrink-0 flex-col rounded-[1.5rem] border border-white/70 bg-white/45 shadow-sm backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/52">
          <header {...provided.dragHandleProps} className="flex items-center justify-between gap-3 border-b border-white/60 px-4 py-3 dark:border-white/10">
            <div>
              <h2 className="font-black text-slate-900 dark:text-white">{column.title}</h2>
              <p className="text-xs font-semibold text-slate-500">{filteredCards.length} cards</p>
            </div>
            {!['todo', 'progress', 'done'].includes(column.id) && (
              <button className="icon-btn h-8 w-8" onClick={() => deleteColumn(column.id)} title="Delete column"><Trash2 className="h-4 w-4" /></button>
            )}
          </header>
          <Droppable droppableId={column.id} type="CARD">
            {(dropProvided, snapshot) => (
              <div ref={dropProvided.innerRef} {...dropProvided.droppableProps} className={classNames('min-h-0 flex-1 space-y-3 overflow-y-auto p-3 transition', snapshot.isDraggingOver && 'bg-cyan-100/50 dark:bg-cyan-950/30')}>
                {filteredCards.map((card, cardIndex) => <Card key={card.id} card={card} index={cardIndex} columnId={column.id} dragDisabled={Boolean(search)} />)}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
          <form onSubmit={submit} className="space-y-2 border-t border-white/60 p-3 dark:border-white/10">
            <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Card title" />
            <textarea className="input min-h-16 resize-none" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
            <div className="flex gap-2">
              <select className="input" value={priority} onChange={(event) => setPriority(event.target.value)}>
                {Object.entries(PRIORITIES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <button className="btn-primary shrink-0"><Plus className="h-4 w-4" /> Add</button>
            </div>
          </form>
        </section>
      )}
    </Draggable>
  );
}
