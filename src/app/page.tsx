'use client';
import React from 'react';
import { useState } from 'react';
import TasksContainer from '../components/TasksContainer';
import { v4 as uuidv4 } from 'uuid'; // Generate unique IDs
import { Task } from '@/types';
import DatePicker from '@/components/Datepicker';
import { DndContext } from '@dnd-kit/core';

export default function Home() {
  // const [tasks, setTasks] = useState<Task[]>([]);

  const todoId = uuidv4();
  const doneId = uuidv4();

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      <div className="grid w-[90%] justify-items-center justify-self-center px-6 pt-6 pb-28">
        <h1 className="text-2xl font-bold font-serif text-center p-8">
          To Do List
        </h1>
        <div className="grid grid-cols-2 gap-8 w-2/3 justify-self-center">
          <DndContext>
            <div>
              <h2 className="text-xl font-semibold text-center p-4">To do</h2>

              <TasksContainer
                // setTasks={setTasks}
                // tasks={tasks}
                key={todoId}
                type="todo"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-center p-4">Done</h2>

              <TasksContainer
                // setTasks={setTasks}
                // tasks={tasks}
                key={doneId}
                type="done"
              />
            </div>
          </DndContext>
        </div>
        {/* <button className="text-white bg-[#32a88b] hover:bg-sky-600 shadow-lg text-base  px-4 py-1.5 rounded-lg w-44 justify-self-end leading-7">
          Guardar cambios
        </button> */}
      </div>
    </div>
  );
}
