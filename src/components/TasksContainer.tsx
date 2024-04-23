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
import { v4 as uuidv4 } from 'uuid'; // Generate unique IDs

import Tasks from '../components/Tasks';

import { CSS } from '@dnd-kit/utilities';

interface TaskContainerProps {
  tasks: Task[];
  type: string;
  columnId: Id;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  createTask: (
    event: React.MouseEvent | React.KeyboardEvent | undefined,
    inputValue?: string,
    type?: 'todo' | 'done',
    date?: Date,
    index?: number
  ) => void;
  removeTask: (id: Id) => void;
  activeTask: Task | null;
  updateTask: (id: string, task: string, dueDate: Date | null) => void;
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
  };

  // const tasksIds = useMemo(() => {
  //   return tasks.map((task) => task.id);
  // }, [tasks]); // Recompute tasksIds when tasks change

  if (isDragging) {
    return (
      <div
        className="relative flex text-white bg-[#32a88b] shadow-lg text-base opacity-30 border-2 border-rose-300 h-10 px-4 py-1.5 rounded-lg w-full leading-7 cursor-grab"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      id="portal">
      {type === 'todo' && (
        <h2 className="text-xl font-semibold text-center p-4">To do</h2>
      )}
      {type === 'done' && (
        <h2 className="text-xl font-semibold text-center p-4">Done</h2>
      )}
      <div className=" bg-white rounded-lg p-5 mb-4 shadow-md text-[#545454]">
        <span style={{ display: type === 'done' ? 'none' : 'block' }}>
          <div className="grid grid-cols-2 pb-2">
            <div className="w-2/3 justify-self-center">Task</div>
            <div className="w-1/3 justify-self-center">Due Date</div>
          </div>
        </span>

        <div className="grid gap-2">
          <SortableContext
            // items={tasksIds}
            items={tasks.map((task) => task.id)}
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
