'use client';
import React, { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useDraggable } from '@dnd-kit/core';
import TrashIcon from '@/icons/TrashIcon';
import CalendarDaysIcon from '@/icons/CalendarDaysIcon';
import { Task } from '@/types';
import DatePicker from './Datepicker';

interface TasksProps {
  task: Task;
  createTask: (event: React.MouseEvent | React.KeyboardEvent) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, task: string, dueDate: Date | null) => void;
  // setInputField: (value: boolean) => void;
  lastElement: boolean;
}

const Tasks = (props: TasksProps) => {
  const {
    task,
    createTask,
    updateTask,
    removeTask,
    // setInputField,
    lastElement,
  } = props;

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
    <div className="flex w-full justify-between align-items-center">
      <div
        className="flex w-full  relative justify-self-stretch text-white bg-[#32a88b] shadow-lg text-base  px-4 py-1.5 rounded-lg leading-7 cursor-grab"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}>
        <div className="w-full ">
          <div>
            {!editMode &&
              (task.task !== ''
                ? task.task
                : (setEditMode(true), (<div></div>)))}

            {editMode && (
              <>
                <input
                  className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0 placeholder:text-gray-100"
                  type="text"
                  id="due-date"
                  autoFocus
                  value={task.task ? task.task : ''}
                  onChange={(e) => {
                    updateTask(task.id.toString(), e.target.value, null);
                  }}
                  onBlur={(e) => {
                    setEditMode(false);
                    if (task.task === '' && lastElement) {
                      removeTask(task.id.toString());
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    setEditMode(false);
                    // setInputField(false);
                    createTask(e);
                  }}
                />
              </>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <DatePicker />
        </div>
      </div>

      <div
        className="flex justify-center items-center cursor-pointer "
        // hidden={!editMode || (task.task === '' && lastElement)}
        onClick={() => removeTask(task.id.toString())}>
        {/* <TrashIcon fill="gray" /> */}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </div>
    </div>
  );
};

export default Tasks;
