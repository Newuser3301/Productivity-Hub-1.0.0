// src/components/Kanban/Board.jsx
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Download } from 'lucide-react';
import Column from './Column';
import AddColumn from './AddColumn';
import SearchFilter from './SearchFilter';
import { useKanbanStore } from '../../store/useKanbanStore';
import { useEisenhowerStore } from '../../store/useEisenhowerStore';

export default function Board() {
  const columns = useKanbanStore((state) => state.columns);
  const search = useKanbanStore((state) => state.search);
  const reorder = useKanbanStore((state) => state.reorder);
  const importMatrixTasks = useKanbanStore((state) => state.importMatrixTasks);
  const matrixTasks = useEisenhowerStore((state) => state.tasks);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <SearchFilter />
        <button className="btn-primary" onClick={() => importMatrixTasks(matrixTasks)}><Download className="h-4 w-4" /> Import Matrix Tasks</button>
      </div>
      <DragDropContext onDragEnd={reorder}>
        <Droppable droppableId="board" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex min-h-0 flex-1 gap-4 overflow-x-auto pb-2">
              {columns.map((column, index) => <Column key={column.id} column={column} index={index} search={search} />)}
              {provided.placeholder}
              <AddColumn />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
