'use client';
import { useDroppable } from '@dnd-kit/core';

const Done = ({ task }) => {
  console.log(task);
  const { setNodeRef } = useDroppable({ id: task.id });

  return (
    <div
      className="text-[#545454]"
      ref={setNodeRef}>
      <ul className="">
        <li>{task}</li>
      </ul>
    </div>
  );
};

export default Done;
