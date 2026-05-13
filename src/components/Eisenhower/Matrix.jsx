// src/components/Eisenhower/Matrix.jsx
import TaskForm from './TaskForm';
import Quadrant from './Quadrant';
import { QUADRANTS } from '../../utils/constants';
import { useEisenhowerStore } from '../../store/useEisenhowerStore';

export default function Matrix() {
  const tasks = useEisenhowerStore((state) => state.tasks);

  return (
    <div className="flex h-full flex-col gap-4">
      <TaskForm />
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
        {QUADRANTS.map((quadrant) => (
          <Quadrant key={quadrant.id} quadrant={quadrant} tasks={tasks[quadrant.id] || []} />
        ))}
      </div>
    </div>
  );
}
