'use client';
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useDraggable } from '@dnd-kit/core';
import CloseIcon from '@/icons/CloseIcon';
import CalendarDaysIcon from '@/icons/CalendarDaysIcon';
import { Task } from '@/types';
import DatePicker from './Datepicker';

interface TaskContainerProps {
  task: Task;
  removeTask: (id: string) => void;
  updateTask: (id: string, task: string) => void;
}

const TasksContainer = (props: TaskContainerProps) => {
  const { task, updateTask, removeTask } = props;

  const [editMode, setEditMode] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task-container',
      task,
    },
    disabled: editMode, // Disable dragging if in edit mode
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // cursor: isDragging ? 'grabbing' : 'pointer', // Change cursor when dragging
  };

  if (isDragging) {
    return (
      <div
        className="relative flex text-white bg-[#32a88b] shadow-lg text-base opacity-60 border-2 border-rose-300 h-10 px-4 py-1.5 rounded-lg w-full leading-7 cursor-grab"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}></div>
    );
  }

  return (
    <div className="flex items-center">
      <div
        className="relative flex text-white bg-[#32a88b] shadow-lg text-base  px-4 py-1.5 rounded-lg w-full leading-7 cursor-grab"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}>
        <div className="w-full">
          {!editMode && task.task}
          {editMode && (
            <input
              className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0 placeholder:text-gray-100"
              type="text"
              autoFocus
              value={task.task}
              onChange={(e) => {
                updateTask(task.id.toString(), e.target.value);
              }}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <div className="flex items-center">
          <DatePicker />
        </div>
      </div>
      <div
        className="w-8 h-8 aligns-self-center"
        onClick={() => removeTask(task.id.toString())}>
        <span className="w-1/2">
          <CloseIcon fill="gray" />
        </span>
      </div>
    </div>
  );
};

export default TasksContainer;
