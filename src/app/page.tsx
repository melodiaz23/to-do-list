'use client';
import React, { useMemo } from 'react';
import { useState } from 'react';
import TasksContainer from '../components/TasksContainer';
import { v4 as uuidv4 } from 'uuid'; // Generate unique IDs
import { Id, Task } from '@/types';
import DatePicker from '@/components/Datepicker';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { create } from 'domain';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [done, setDone] = useState<Task[]>([]);
  const [adding, setAdding] = useState(false);

  const todoId = useMemo(() => uuidv4(), []);
  const doneId = useMemo(() => uuidv4(), []);

  const createTask = (
    event: React.MouseEvent | React.KeyboardEvent | undefined,
    inputValue?: string,
    type: 'todo' | 'done' = 'todo',
    date?: Date
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

  const removeTask = (id: Id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const doneTask = (id: string, taskDone: string | null) => {
    const newDone: Task = {
      id: id,
      columnId: doneId,
      type: 'done',
      task: taskDone,
      dueDate: null,
    };

    if (done.length > 0) return;

    removeTask(id);
    setDone([...done, newDone]);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px
      },
    })
  );

  // ACTIVE CARD
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // DRAG AND DROP
  const onDragStart = (event: DragStartEvent) => {
    // Dragging a card from another column
    if (event.active.data.current?.type === 'todo') {
      setActiveTask(event.active.data.current.task);
      return;
    }

    // if (event.active.data.current?.type === 'done') {
    //   setActiveTask(event.active.data.current.task);
    //   return;
    // }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null); // Reset active card, when dropped
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id;
    const overTaskId = over.id;

    console.log(active.data.current?.type);
    console.log(over?.data.current?.type);
    if (active.data.current?.type === 'todo') return;

    //if not in the same column
    if (
      active.data.current?.sortable.containerId !==
      over?.data.current?.sortable.containerId
    )
      return;

    const containerName = active.data.current?.sortable.containerId;

    // Change items based on drag end position

    // setTasks((tasks) => {
    //   // const tempTasks = { ...tasks };
    //   // const oldIndex = tempTasks[containerName].indexOf(active.id.toString());
    //   // const newIndex = tempTasks[containerName].indexOf(over?.id.toString());
    //   // // tempTasks[containerName] = arrayMove(tempTasks[containerName], oldIndex, newIndex);
    //   // // return tempTasks;
    // });

    // if (!over) {
    //   return;
    // }

    // const activeTaskId = active.id;
    // const overTaskId = over.id;

    // if (activeTaskId === overTaskId) {
    //   return;
    // }

    // setTasks((tasks) => {
    //   const activeIndex = tasks.findIndex((task) => task.id === activeTaskId);
    //   const overIndex = tasks.findIndex((task) => task.id === overTaskId);
    //   return arrayMove(tasks, activeIndex, overIndex);
    // });

    // if (active.data.current?.type === 'done') {
    //   createTask(
    //     undefined,
    //     active.data.current.task,
    //     'done',
    //     active.data.current.dueDate
    //   );

    //   setDone((done) => {
    //     const activeIndex = done.findIndex((task) => task.id === activeTaskId);
    //     const overIndex = done.findIndex((task) => task.id === overTaskId);
    //     return arrayMove(done, activeIndex, overIndex);
    //   });
    // }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) return;

    const isActiveTask = active.data.current?.type === 'todo';
    const isOverTask = over.data.current?.type === 'todo';

    // Droping inside the TODO list-

    ///THIS WORKING
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        // to find the index
        const activeIndex = tasks.findIndex((task) => task.id === activeTaskId);
        const overIndex = tasks.findIndex((task) => task.id === overTaskId);

        // If in the same column
        // tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Droping to the DONE list

    const isOverDone = over.data.current?.type === 'done';

    if (isActiveTask && isOverDone) {
      const activeIndex = tasks.findIndex((task) => task.id === activeTaskId);
      const overIndex = tasks.findIndex((task) => task.id === overTaskId);
      tasks[activeIndex].columnId = doneId;

      setDone((done) => {
        doneTask(tasks[activeIndex].id.toString(), tasks[activeIndex].task);
        return arrayMove(done, activeIndex, overIndex);
      });
    }

    // // Droping to a DONE list
    // const isOverDone = over.data.current?.type === 'done';

    // if (isActiveTask && isOverDone) {
    //   setTasks((tasks) => {
    //     // to find the index
    //     const activeIndex = tasks.findIndex((task) => task.id === activeTaskId);

    //     // to change the type
    //     tasks[overIndex].type = over.type;

    //     return arrayMove(tasks, activeIndex, overIndex);
    //   });
    // }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      <div className="grid w-[90%] justify-items-center justify-self-center px-6 pt-6 pb-28">
        <h1 className="text-2xl font-bold font-serif text-center p-8">
          To Do List
        </h1>
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          sensors={sensors}
          id="instanceId">
          <div className="grid grid-cols-2 gap-8 w-2/3 justify-self-center">
            <TasksContainer
              tasks={tasks}
              columnId={todoId}
              type="todo"
              setTasks={setTasks}
              createTask={createTask}
              activeTask={activeTask}
              removeTask={removeTask}
            />
            <TasksContainer
              columnId={doneId}
              type="done"
              tasks={done}
              setTasks={setTasks}
              createTask={createTask}
              activeTask={activeTask}
              removeTask={removeTask}
            />
          </div>
        </DndContext>
        <form
          name="task"
          id="task"
          className="grid gap-2">
          <div className="flex justify-between text-white bg-[#32a88b] shadow-lg text-base  px-4 py-1.5 rounded-lg w-full leading-7">
            <div className="w-full">
              <button
                className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0 placeholder:text-gray-100"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();

                  createTask(e, '', 'todo');
                  setAdding(!adding);
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
