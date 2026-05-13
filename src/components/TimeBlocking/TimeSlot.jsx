// src/components/TimeBlocking/TimeSlot.jsx
import { X } from 'lucide-react';
import { clamp } from '../../utils/helpers';
import { useTimeBlockStore } from '../../store/useTimeBlockStore';

export default function TimeSlot({ dateKey, hour, block, onEmptyClick, onMoveBlock }) {
  const deleteBlock = useTimeBlockStore((state) => state.deleteBlock);
  const resizeBlock = useTimeBlockStore((state) => state.resizeBlock);

  const handleDrop = (event) => {
    event.preventDefault();
    const blockId = event.dataTransfer.getData('text/time-block-id');
    if (blockId) onMoveBlock(blockId, dateKey, hour);
  };

  const cellProps = {
    onDragOver: (event) => event.preventDefault(),
    onDrop: handleDrop
  };

  if (block && block.startHour !== hour) {
    return <div {...cellProps} className="min-h-16 border-b border-r border-white/60 bg-white/28 dark:border-white/10 dark:bg-slate-900/38" />;
  }

  return (
    <div
      {...cellProps}
      role="button"
      tabIndex={0}
      className="relative min-h-16 border-b border-r border-white/60 bg-white/35 text-left transition hover:bg-cyan-50/70 dark:border-white/10 dark:bg-slate-950/42 dark:hover:bg-slate-900"
      onClick={() => !block && onEmptyClick(dateKey, hour)}
      onKeyDown={(event) => {
        if (!block && (event.key === 'Enter' || event.key === ' ')) onEmptyClick(dateKey, hour);
      }}
    >
      {block && (
        <div
          className="group absolute inset-x-1 top-1 z-10 rounded-2xl p-2 text-white shadow-soft transition hover:brightness-105"
          style={{ background: block.color, height: `calc(${block.duration * 4}rem - 0.5rem)` }}
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData('text/time-block-id', block.id);
            event.dataTransfer.effectAllowed = 'move';
          }}
          title="Drag to move. Use slider to resize."
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{block.title}</p>
              <p className="line-clamp-2 text-xs opacity-90">{block.description}</p>
            </div>
            <button type="button" className="rounded bg-white/20 p-1 opacity-0 transition hover:bg-white/30 group-hover:opacity-100" onClick={(event) => { event.stopPropagation(); deleteBlock(block.id); }} title="Delete block">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <input
            type="range"
            min="1"
            max={clamp(22 - block.startHour, 1, 8)}
            value={block.duration}
            className="absolute bottom-1 left-2 right-2 h-1 opacity-0 transition group-hover:opacity-100"
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => resizeBlock(block.id, Number(event.target.value))}
            title="Resize duration"
          />
        </div>
      )}
    </div>
  );
}
