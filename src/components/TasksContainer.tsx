'use client';
import { Id, Task } from '@/types';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import Tasks from '../components/Tasks';

import { CSS } from '@dnd-kit/utilities';

interface TaskContainerProps {
  tasks: Task[];
  type: string;
  columnId: Id;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  createTask: (
    event: React.MouseEvent | React.KeyboardEvent | React.FormEvent | undefined,
    inputValue?: string,
    type?: 'todo' | 'done',
    date?: Date,
    index?: number
  ) => void;
  removeTask: (id: Id) => void;
  activeTask: Task | null;
  updateTask: (id: string, task: string | null, dueDate: Date | null) => void;
}

export default function TasksContainer(props: TaskContainerProps) {
  const {
    type,
    columnId,
    setTasks,
    tasks,
    createTask,
    activeTask,
    removeTask,
    updateTask,
  } = props;

  const [enableAddBtn, setEnableAddBtn] = useState(true);
  const [dragEnabled, setDragEnabled] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columnId,
    data: {
      type: `${type}-container`,
      tasks,
    },
    disabled: enableAddBtn || dragEnabled, // Disable dragging if a task is being added
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // cursor: isDragging ? 'grabbing' : 'pointer', // Change cursor when dragging
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      id="portal">
      <h2 className="text-xl font-aleo font-semibold text-center p-4">
        {type === 'todo' ? 'TODO' : 'DONE'}
      </h2>
      <div
        className={`w-80 min-h-16 lg:min-h-36 lg:w-[440px] lg:min-w-[440px] bg-white rounded-lg p-4 lg:p-6 shadow-md text-[#545454] border-t-4 ${
          type === 'todo'
            ? 'border-t-amber-600 pr-2 lg:pr-3'
            : 'border-t-teal-500'
        }`}
        onClick={(e) => {
          if (type === 'done') return;
          createTask(undefined, '', 'todo');
        }}>
        {/* <span style={{ display: type === 'done' ? 'none' : 'block' }}>
          <div className="flex justify-between pb-2">
            <div className=" justify-self-center">Task</div>
            <div className=" justify-self-center">Due Date</div>
          </div>
        </span> */}

        <div className="grid gap-2">
          <SortableContext
            items={tasks.map((task) => task)}
            strategy={verticalListSortingStrategy}>
            <div className="grid gap-2">
              {tasks.map(
                (task, idx) =>
                  // Check if task is truthy and has an id property
                  task &&
                  task.id && (
                    <Tasks
                      key={task.id}
                      task={task}
                      createTask={createTask}
                      updateTask={updateTask}
                      removeTask={removeTask}
                      lastElement={idx === tasks.length - 1}
                    />
                  )
              )}
            </div>
            {/* {typeof document !== 'undefined' &&
              createPortal(
                <DragOverlay>
                  {activeTask && (
                    <Tasks
                      key={activeTask.id}
                      task={activeTask}
                      createTask={createTask}
                      updateTask={updateTask}
                      removeTask={removeTask}
                      lastElement={false}
                    />
                  )}
                </DragOverlay>,
                document.body
              )} */}
          </SortableContext>
        </div>
      </div>

      {activeTask && (
        <DragOverlay>
          <Tasks
            key={activeTask.id}
            task={activeTask}
            createTask={createTask}
            updateTask={updateTask}
            removeTask={removeTask}
            lastElement={false}
          />
        </DragOverlay>
      )}
    </div>
  );
}
