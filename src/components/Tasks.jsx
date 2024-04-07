'use client';
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Image from 'next/image';

const Tasks = ({ uniqueId, addTask, idx }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: uniqueId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <tr
        className="relative grid grid-cols-[3fr_1fr] text-white bg-[#32a88b] shadow-lg text-base  px-4 py-1.5 rounded-lg w-full leading-7 cursor-grab"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}>
        <td className="w-full">
          <input
            type="text"
            placeholder="Task name"
            className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0 placeholder:text-gray-100"
            autoFocus="true"
            onKeyUp={(e) => e.key === 'Enter' && addTask(e, idx)}
          />
          <span
            className="absolute w-20 h-20 -right-16 -top-2 group"
            onClick={() => setTask(tasks.filter((task) => task.id !== id))}>
            <Image
              src="close-circle-outline.svg"
              alt="close icon"
              width={20}
              height={20}
              className="w-1/3 invisible group-hover:visible"
            />
          </span>
        </td>
        <td>
          <input
            className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0"
            type="date"
            id="due-date"
            placeholder="Choose a due date"
            required
          />
        </td>
      </tr>
    </>
  );
};

export default Tasks;
