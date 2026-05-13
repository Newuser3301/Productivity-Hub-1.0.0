// src/components/Eisenhower/TaskForm.jsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { QUADRANTS } from '../../utils/constants';
import { useEisenhowerStore } from '../../store/useEisenhowerStore';

export default function TaskForm() {
  const [text, setText] = useState('');
  const [quadrant, setQuadrant] = useState('do');
  const addTask = useEisenhowerStore((state) => state.addTask);

  const submit = (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    addTask(quadrant, text);
    setText('');
  };

  return (
    <form onSubmit={submit} className="panel flex flex-col items-stretch gap-3 p-4 md:flex-row md:items-center">
      <input className="input" value={text} onChange={(event) => setText(event.target.value)} placeholder="Add a priority task..." />
      <select className="input md:max-w-64" value={quadrant} onChange={(event) => setQuadrant(event.target.value)}>
        {QUADRANTS.map((item) => <option key={item.id} value={item.id}>{item.subtitle}</option>)}
      </select>
      <button className="btn-primary shrink-0" type="submit"><Plus className="h-4 w-4" /> Add Task</button>
    </form>
  );
}
