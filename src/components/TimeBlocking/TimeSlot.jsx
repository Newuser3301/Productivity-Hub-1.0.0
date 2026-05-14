// src/components/TimeBlocking/TimeSlot.jsx
import { X } from 'lucide-react';
import { clamp, durationHoursToMinutes, minutesToDurationLabel } from '../../utils/helpers';
import { useTimeBlockStore } from '../../store/useTimeBlockStore';
import { HOURS } from '../../utils/constants';

export default function TimeSlot({ dateKey, hour, block, onEmptyClick, onMoveBlock }) {
  const deleteBlock = useTimeBlockStore((state) => state.deleteBlock);
  const resizeBlock = useTimeBlockStore((state) => state.resizeBlock);
  const blockDurationMinutes = durationHoursToMinutes(block?.duration);
  const blockColor = block?.color === '#ef4444' ? '#dc2626' : block?.color;

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
    return <div {...cellProps} className="min-h-16 border-b border-r border-slate-200/90 bg-slate-50/45 dark:border-slate-800 dark:bg-slate-900/38" />;
  }

  return (
    <div
      {...cellProps}
      role="button"
      tabIndex={0}
      className="relative min-h-16 border-b border-r border-slate-200/90 bg-white/60 text-left transition hover:bg-cyan-50/80 dark:border-slate-800 dark:bg-slate-950/42 dark:hover:bg-slate-900"
      onClick={() => !block && onEmptyClick(dateKey, hour)}
      onKeyDown={(event) => {
        if (!block && (event.key === 'Enter' || event.key === ' ')) onEmptyClick(dateKey, hour);
      }}
    >
      {block && (
        <div
          className="group absolute inset-x-1.5 top-1 z-10 overflow-hidden rounded-xl border border-white/55 p-2 text-white shadow-[0_14px_28px_rgba(15,23,42,0.22)] ring-1 ring-slate-950/20 transition hover:brightness-105 dark:border-white/30"
          style={{ background: blockColor, height: `max(2.75rem, calc(${block.duration * 4}rem - 0.5rem))` }}
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData('text/time-block-id', block.id);
            event.dataTransfer.effectAllowed = 'move';
          }}
          title="Drag to move. Use slider to resize."
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-black drop-shadow-sm">{block.title}</p>
              <p className="text-[11px] font-black uppercase text-white/95 drop-shadow-sm">{minutesToDurationLabel(blockDurationMinutes)}</p>
              {blockDurationMinutes >= 45 && <p className="line-clamp-2 text-xs text-white/92">{block.description}</p>}
            </div>
            <button type="button" className="rounded bg-white/20 p-1 opacity-0 transition hover:bg-white/30 group-hover:opacity-100" onClick={(event) => { event.stopPropagation(); deleteBlock(block.id); }} title="Delete block">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <input
            type="range"
            min="15"
            max={clamp((HOURS[HOURS.length - 1] + 1 - block.startHour) * 60, 15, 8 * 60)}
            step="15"
            value={blockDurationMinutes}
            className="absolute bottom-1 left-2 right-2 h-1 opacity-0 transition group-hover:opacity-100"
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => resizeBlock(block.id, Number(event.target.value) / 60)}
            title={`Resize duration (${minutesToDurationLabel(blockDurationMinutes)})`}
          />
        </div>
      )}
    </div>
  );
}
