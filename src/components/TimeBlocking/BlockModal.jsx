// src/components/TimeBlocking/BlockModal.jsx
import { useState } from 'react';
import { X } from 'lucide-react';
import { BLOCK_COLORS } from '../../utils/constants';

export default function BlockModal({ slot, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(1);
  const [color, setColor] = useState(BLOCK_COLORS[0].value);

  if (!slot) return null;

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSave({ date: slot.date, startHour: slot.hour, duration: Number(duration), title: title.trim(), description: description.trim(), color });
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
            Duration
            <select className="input mt-1" value={duration} onChange={(event) => setDuration(event.target.value)}>
              {[1, 2, 3, 4].map((value) => <option key={value} value={value}>{value} hour{value > 1 ? 's' : ''}</option>)}
            </select>
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
