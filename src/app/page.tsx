'use client';
import { Id, Task } from '@/types';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid'; // Generate unique IDs
import Done from '../components/Done';
import TasksContainer from '../components/TasksContainer';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputField, setInputField] = useState(false);
  const [tasksDone, settasksDone] = useState([]);
  // const taskId = useMemo(() => {
  //   tasks.map((task) => task.id);
  // }, [tasks]);

  // ACTIVE CARD
  const [activeCard, setActiveCard] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px
      },
    })
  );

  const createTask = (
    event: React.MouseEvent | React.KeyboardEvent,
    inputValue?: string,
    index?: number
  ) => {
    const newTask: Task = { id: uuidv4(), task: inputValue || '' };
    // if (index === tasks.length - 1 || event.type === 'click') {
    setTasks([...tasks, newTask]);
    // }
  };

  const updateTask = (id: Id, taskValue: string) => {
    const updateTasks = tasks.map((task) => {
      if (task.id !== id) return { id: task.id, task: task.task };

      return { id: task.id, task: taskValue };
    });
    setTasks(updateTasks);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // DRAG AND DROP
  const onDragStart = (event: DragStartEvent) => {
    console.log('DRAG START', event);
    if (event.active.data.current?.type === 'task-container') {
      setActiveCard(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) {
      return;
    }

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((task) => task.id === activeTaskId);
      const overIndex = tasks.findIndex((task) => task.id === overTaskId);

      return arrayMove(tasks, activeIndex, overIndex);
    });
  };

  return (
    <div>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
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
                  <div className="w-full grid gap-3">
                    <div className="grid">
                      <div className="grid grid-cols-2">
                        <div className="w-2/3 justify-self-center">Task</div>
                        <div className="w-1/3 justify-self-center">
                          Due Date
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2 w-full">
                      <SortableContext
                        items={tasks.map((task) => task.id)}
                        strategy={verticalListSortingStrategy}>
                        {tasks.map((task, idx) => {
                          return (
                            <TasksContainer
                              key={task.id}
                              task={task}
                              updateTask={updateTask}
                              removeTask={removeTask}
                            />
                          );
                        })}
                      </SortableContext>
                      <form
                        action=""
                        name="task"
                        className="grid gap-2">
                        {inputField && (
                          <div className="flex justify-between text-white bg-[#32a88b] shadow-lg text-base  px-4 py-1.5 rounded-lg w-full leading-7">
                            <div className="w-full">
                              <input
                                type="text"
                                placeholder="Task name"
                                className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0 placeholder:text-gray-100"
                                autoFocus
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between text-white bg-[#32a88b] shadow-lg text-base  px-4 py-1.5 rounded-lg w-full leading-7">
                          <div className="w-full">
                            <button
                              className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0 placeholder:text-gray-100"
                              onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                inputValue && createTask(e, inputValue);
                                setInputField(true);
                                setInputValue('');
                              }}>
                              Add a new task +
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
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
        {createPortal(
          <DragOverlay>
            {activeCard && (
              <TasksContainer
                task={activeCard}
                updateTask={updateTask}
                removeTask={removeTask}></TasksContainer>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
