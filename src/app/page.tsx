'use client';
import React, { useEffect, useMemo } from 'react';
import { useState } from 'react';
import TasksContainer from '../components/TasksContainer';
import { v4 as uuidv4 } from 'uuid'; // Generate unique IDs
import { Id, Task } from '@/types';
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
import { arrayMove } from '@dnd-kit/sortable';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [done, setDone] = useState<Task[]>([]);
  const [adding, setAdding] = useState(false);

  const todoId = useMemo(() => uuidv4(), []);
  const doneId = useMemo(() => uuidv4(), []);

  const memoizedTasks = useMemo(() => tasks, [tasks]);
  const memoizedDone = useMemo(() => done, [done]);

  const createTask = (
    event: React.MouseEvent | React.KeyboardEvent | React.FormEvent | undefined,
    inputValue?: string | null,
    type: 'todo' | 'done' = 'todo',
    date?: Date
  ) => {
    if (tasks.length > 0 && tasks[tasks.length - 1].task === '') {
      console.log('CANT CREATE TASK');
      return;
    }
    // if (!inputValue?.trim()) return;
    const newTask: Task = {
      id: uuidv4(),
      columnId: todoId,
      type: 'todo',
      task: inputValue?.trim() || '',
      dueDate: null,
    };

    setTasks([...tasks, newTask]);
  };

  const removeTask = (id: Id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (
    id: Id,
    taskValue: string | null,
    dueDate: Date | null,
    type?: 'todo' | 'done'
  ) => {
    if (id && taskValue === '') {
      console.log('REMOVE TASK', id, taskValue, dueDate, type);
      removeTask(id);
      return;
    }
    if (!taskValue?.trim()) return;

    const updateTasks = tasks.map((task) => {
      if (task.id !== id)
        return {
          id: task.id,
          columnId: task.columnId,
          type: 'todo',
          task: task.task,
          dueDate: task.dueDate,
        };
      return {
        id: task.id,
        columnId: task.type === 'todo' ? todoId : doneId,
        type: task.type,
        task: taskValue,
        dueDate: dueDate,
      };
    });
    setTasks(updateTasks);
  };

  const doneTask = (
    id: string,
    taskDone: string | null,
    dueDate: Date | null
  ) => {
    if (!taskDone) return;
    const newDone: Task = {
      id: id,
      columnId: doneId,
      type: 'done',
      task: taskDone,
      dueDate: dueDate,
    };
    removeTask(id);
    setDone([...done, newDone]);
  };

  const removeDoneTask = (id: string) => {
    setDone(done.filter((task) => task.id !== id));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px
      },
    })
  );

  // useEffect(() => {
  //   tasks;
  // }, [tasks, done]);

  // ACTIVE CARD
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // DRAG AND DROP
  const onDragStart = (event: DragStartEvent) => {
    // Dragging a card from another column
    if (event.active.data.current?.type === 'task') {
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

    if (active.data.current?.type === 'task') return;
    if (over?.data.current?.type === 'done-container') return;
    if (over?.data.current?.type === 'todo-container') return;
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id;
    const overTaskId = over.id;
    if (activeTaskId === overTaskId) return;

    const isActiveTask = active.data.current?.type === 'task';
    const isOverTask = over.data.current?.type === 'task';
    // Droping inside the SAME list
    const isOverToDo = over.data.current?.type === 'todo-container';

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setDone((prevDone) => {
        const updatedTasks = [...prevDone];
        const activeIndex = updatedTasks.findIndex(
          (task) => task.id === activeTaskId
        );
        const overIndex = updatedTasks.findIndex(
          (task) => task.id === overTaskId
        );
        if (activeIndex === -1 || overIndex === -1) return prevDone;

        return arrayMove(updatedTasks, activeIndex, overIndex);
      });

      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        const activeIndex = updatedTasks.findIndex(
          (task) => task.id === activeTaskId
        );
        const overIndex = updatedTasks.findIndex(
          (task) => task.id === overTaskId
        );

        if (activeIndex === -1 || overIndex === -1) return updatedTasks;

        updatedTasks[activeIndex].columnId = updatedTasks[overIndex].columnId;

        return arrayMove(updatedTasks, activeIndex, overIndex); // Araymove take as arguments the array, the index of the element to move, and the new index
      });
    }

    // Droping to the DONE list
    const isOverDone = over.data.current?.type === 'done-container';
    if (isActiveTask && isOverDone) {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        const activeIndex = prevTasks.findIndex(
          (task) => task.id === activeTaskId
        );
        const overIndex = updatedTasks.findIndex(
          (task) => task.id === overTaskId
        );
        if (activeIndex === -1) return updatedTasks;
        updatedTasks[activeIndex].columnId = doneId;
        updatedTasks[activeIndex].type = 'done';
        const filteredTasks = updatedTasks.filter(
          (task) => task.id !== activeTaskId
        );

        doneTask(
          activeTaskId.toString(),
          tasks[activeIndex].task,
          tasks[activeIndex].dueDate
        );
        // arrayMove(filteredTasks, activeIndex, activeIndex);
        return filteredTasks;
      });
    }

    // Droping to the TODO list from the DONE list
    if (isActiveTask && isOverToDo) {
      setDone((prevDone) => {
        const activeIndex = prevDone.findIndex(
          (task) => task.id === activeTaskId
        );
        const updateDoneTasks = [...prevDone];
        if (activeIndex === -1) return updateDoneTasks;
        updateDoneTasks[activeIndex].columnId = todoId;
        updateDoneTasks[activeIndex].type = 'todo';
        removeDoneTask(activeTaskId.toString());
        setTasks(() => {
          return [
            ...tasks,
            ...updateDoneTasks.filter((task) => task.id === activeTaskId),
          ];
        });
        return updateDoneTasks.filter((task) => task.id !== activeTaskId);
      });
    }
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="w-full">
        <h1 className="text-3xl font-aleo font-600 font-bold bg-teal-700 font-jersey-10 text-center p-8 text-teal-50">
          TODO LIST
        </h1>
      </div>

      <form
        name="task"
        id={`task-form`}
        className="p-8">
        <div className="w-full">
          <button
            className="w-full font-aleo border-0 px-4 py-2 text-teal-50 text-xl font-semibold shadow-md rounded-lg leading-7 bg-teal-600 outline-0 placeholder:text-gray-100"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              createTask(e, null, 'todo');
              setAdding(!adding);
            }}>
            Add a new task +
          </button>
        </div>
      </form>

      <div className="justify-self-center lg:px-6 pb-28">
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          sensors={sensors}
          id="instanceId">
          <div className="flex flex-col lg:flex-row gap-8 w-full justify-self-center">
            <TasksContainer
              columnId={todoId}
              tasks={memoizedTasks}
              type="todo"
              setTasks={setTasks}
              createTask={createTask}
              activeTask={activeTask}
              removeTask={removeTask}
              updateTask={updateTask}
            />
            <TasksContainer
              columnId={doneId}
              tasks={memoizedDone}
              type="done"
              setTasks={setTasks}
              createTask={createTask}
              activeTask={activeTask}
              removeTask={removeTask}
              updateTask={updateTask}
            />
          </div>
        </DndContext>
      </div>
    </div>
  );
}
