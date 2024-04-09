'use client';
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Image from 'next/image';
import { useDraggable } from '@dnd-kit/core';
import CloseIcon from '@/icons/Close';

const TasksContainer = ({ task, createTask, removeTask }) => {
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
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
    <div className="flex">
      <div
        className="relative flex text-white bg-[#32a88b] shadow-lg text-base  px-4 py-1.5 rounded-lg w-full leading-7 cursor-grab"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}>
        <div className="w-full">
          <input
            type="text"
            placeholder="Task name"
            className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0 placeholder:text-gray-100"
            autoFocus="true"
            onKeyUp={(e) => e.key === 'Enter' && createTask(e, idx)}
          />
        </div>
        <div>
          <input
            className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0"
            type="date"
            id="due-date"
            placeholder="Choose a due date"
            required
          />
        </div>
      </div>
      <div
        className="w-8 h-8 aligns-self-center"
        onClick={() => removeTask(uniqueId)}>
        <span className="w-1/2">
          <CloseIcon fill="gray" />
        </span>
      </div>
    </div>
  );
};

export default TasksContainer;
