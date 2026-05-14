// src/components/TimeBlocking/BlockModal.jsx
import { useState } from 'react';
import { X } from 'lucide-react';
import { BLOCK_COLORS, HOURS } from '../../utils/constants';
import { clamp, minutesToDurationLabel } from '../../utils/helpers';

export default function BlockModal({ slot, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [color, setColor] = useState(BLOCK_COLORS[0].value);

  if (!slot) return null;

  const maxDurationMinutes = (HOURS[HOURS.length - 1] + 1 - slot.hour) * 60;
  const durationHours = Math.floor(durationMinutes / 60);
  const durationRemainderMinutes = durationMinutes % 60;
  const setClampedDurationMinutes = (value) => setDurationMinutes(clamp(Math.round(Number(value) || 1), 1, maxDurationMinutes));

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSave({ date: slot.date, startHour: slot.hour, duration: durationMinutes / 60, title: title.trim(), description: description.trim(), color });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-6">
      <form onSubmit={submit} className="w-full max-w-lg rounded-[1.6rem] border border-white/70 bg-white/75 p-5 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/80">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black">New Time Block</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{slot.date} at {slot.hour}:00</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} title="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" autoFocus />
          <textarea className="input min-h-24 resize-none" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
            Duration <span className="text-xs font-black text-cyan-700 dark:text-cyan-300">({minutesToDurationLabel(durationMinutes)})</span>
            <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1.25fr]">
              <span>
                <span className="mb-1 block text-xs font-black uppercase text-slate-400">Hours</span>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max={Math.floor(maxDurationMinutes / 60)}
                  value={durationHours}
                  onChange={(event) => setClampedDurationMinutes((Number(event.target.value) * 60) + durationRemainderMinutes)}
                />
              </span>
              <span>
                <span className="mb-1 block text-xs font-black uppercase text-slate-400">Minutes</span>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="59"
                  value={durationRemainderMinutes}
                  onChange={(event) => setClampedDurationMinutes((durationHours * 60) + clamp(Number(event.target.value) || 0, 0, 59))}
                />
              </span>
              <span className="col-span-2 sm:col-span-1">
                <span className="mb-1 block text-xs font-black uppercase text-slate-400">Total minutes</span>
                <input
                  className="input"
                  type="number"
                  min="1"
                  max={maxDurationMinutes}
                  value={durationMinutes}
                  onChange={(event) => setClampedDurationMinutes(event.target.value)}
                />
              </span>
            </div>
            <input
              className="mt-3 w-full accent-cyan-700"
              type="range"
              min="1"
              max={maxDurationMinutes}
              step="5"
              value={durationMinutes}
              onChange={(event) => setClampedDurationMinutes(event.target.value)}
              title="Fine tune duration"
            />
          </label>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Color</p>
            <div className="flex gap-2">
              {BLOCK_COLORS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`h-9 w-9 rounded-full border-4 ${color === item.value ? 'border-slate-900 dark:border-white' : 'border-transparent'}`}
                  style={{ background: item.value }}
                  onClick={() => setColor(item.value)}
                  title={item.name}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary">Save block</button>
        </div>
      </form>
    </div>
  );
}
