'use client';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

const Done = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: 'done',
      data: {
        type: 'done',
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="text-[#545454]"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}>
      <ul className="">
        <li>{task}</li>
      </ul>
    </div>
  );
};

export default Done;
