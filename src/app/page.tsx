'use client';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Generate unique IDs

import Done from '../components/Done';
import Tasks from '../components/Tasks';

export default function Home() {
  const [tasks, setTasks] = useState([{ id: uuidv4() }]);
  const [tasksDone, settasksDone] = useState([]);

  const addTask = (
    event: React.MouseEvent | React.KeyboardEvent,
    index?: number
  ) => {
    if (index === tasks.length - 1) {
      setTasks([...tasks, { id: uuidv4() }]);
    }
    if (event.type === 'click') {
      setTasks([...tasks, { id: uuidv4() }]);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    console.log(active, over);
  };

  return (
    <div>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(e) => handleDragEnd(e)}
        sensors={useSensors(useSensor(MouseSensor))}
        id="instanceId">
        <div className="grid px-6 pt-6 pb-28">
          <h1 className="text-2xl font-bold font-serif text-center p-8">
            To Do List
          </h1>
          <div className="grid grid-cols-2 gap-8 w-2/3 justify-self-center">
            <div>
              <h2 className="text-xl font-semibold text-center p-4">To do</h2>
              <div className="grid bg-white rounded-lg p-5 mb-4 shadow-md">
                <div className="text-[#545454]">
                  <table className="w-full grid gap-3">
                    <thead className="grid">
                      <tr className="grid grid-cols-2">
                        <th className="w-2/3 justify-self-center">Task</th>
                        <th className="w-1/3 justify-self-center">Due Date</th>
                      </tr>
                    </thead>

                    <tbody className="grid gap-2 w-full">
                      <SortableContext
                        items={tasks}
                        strategy={verticalListSortingStrategy}>
                        {tasks.map((task, idx) => {
                          return (
                            <Tasks
                              key={task.id}
                              uniqueId={task.id}
                              addTask={addTask}
                              idx={idx}
                            />
                          );
                        })}

                        <tr className="flex justify-between text-white bg-[#32a88b] shadow-lg text-base  px-4 py-1.5 rounded-lg w-full leading-7">
                          <td className="w-full">
                            <button
                              className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0 placeholder:text-gray-100"
                              onClick={(e: React.MouseEvent) => addTask(e)}>
                              Add a new task +
                            </button>
                          </td>
                        </tr>
                      </SortableContext>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-center p-4">Done</h2>

              <div className="grid grid-rows-[auto_auto] bg-white rounded-lg p-5 mb-4 shadow-md">
                {tasksDone.map((task) => {
                  return (
                    <Done
                      task={task}
                      key={task}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <button className="text-white bg-[#32a88b] hover:bg-sky-600 shadow-lg text-base  px-4 py-1.5 rounded-lg w-44 justify-self-end leading-7">
            Guardar cambios
          </button>
        </div>
      </DndContext>
    </div>
  );
}
