'use client';
import React, { useMemo } from 'react';
import { useState } from 'react';
import TasksContainer from '../components/TasksContainer';
import { v4 as uuidv4 } from 'uuid'; // Generate unique IDs
import { Task } from '@/types';
import DatePicker from '@/components/Datepicker';
import { DndContext } from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [adding, setAdding] = useState(false);

  const todoId = useMemo(() => uuidv4(), []);
  const doneId = useMemo(() => uuidv4(), []);

  const createTask = (
    event: React.MouseEvent | React.KeyboardEvent,
    inputValue?: string,
    date?: Date,
    index?: number
  ) => {
    const newTask: Task = {
      id: uuidv4(),
      columnId: todoId,
      type: 'todo',
      task: inputValue || '',
      dueDate: null,
    };

    if (tasks.length > 0 && tasks[tasks.length - 1].task === '') {
      console.log('CANT CREATE TASK');
      return;
    } else {
      setTasks([...tasks, newTask]);
      // setInputField(true);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      <div className="grid w-[90%] justify-items-center justify-self-center px-6 pt-6 pb-28">
        <h1 className="text-2xl font-bold font-serif text-center p-8">
          To Do List
        </h1>
        <div className="grid grid-cols-2 gap-8 w-2/3 justify-self-center">
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={horizontalListSortingStrategy}>
            <TasksContainer
              columnId={todoId}
              type="todo"
              tasks={tasks.filter((task) => task.columnId === todoId)}
              setTasks={setTasks}
              createTask={createTask}
            />
            <TasksContainer
              columnId={doneId}
              type="done"
              tasks={tasks.filter((task) => task.columnId === doneId)}
              setTasks={setTasks}
              createTask={createTask}
            />
          </SortableContext>
        </div>
        {/* <button className="text-white bg-[#32a88b] hover:bg-sky-600 shadow-lg text-base  px-4 py-1.5 rounded-lg w-44 justify-self-end leading-7">
          Guardar cambios
        </button> */}
        <form
          name="task"
          id="task"
          className="grid gap-2"
          // style={{ display: type === 'done' ? 'none' : 'block' }}
        >
          <div className="flex justify-between text-white bg-[#32a88b] shadow-lg text-base  px-4 py-1.5 rounded-lg w-full leading-7">
            <div className="w-full">
              <button
                className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0 placeholder:text-gray-100"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  // inputValue &&
                  createTask(e, '');
                  setAdding(!adding);

                  // setInputValue('');
                }}>
                Add a new task +
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
