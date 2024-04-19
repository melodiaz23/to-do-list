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
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid'; // Generate unique IDs
import Done from '../components/Done';
import Tasks from '../components/Tasks';
import CloseIcon from '@/icons/CloseIcon';
import CalendarDaysIcon from '@/icons/CalendarDaysIcon';
import DatePicker from '../components/Datepicker';
import ReactDOM from 'react-dom';
import { HtmlContext } from 'next/dist/server/future/route-modules/app-page/vendored/contexts/entrypoints';

interface TaskContainerProps {
  type: string;
  // setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  // tasks: Task[];
}

export default function TasksContainer(props: TaskContainerProps) {
  // const { type, tasks, setTasks } = props;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputField, setInputField] = useState(false); // Input field state when creating new task
  const [adding, setAdding] = useState(false);
  const [tasksDone, setTasksDone] = useState([]);

  const columnId = useMemo(() => uuidv4(), []);

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

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
    date?: Date,
    index?: number
  ) => {
    const newTask: Task = {
      id: uuidv4(),
      columnId: columnId,
      type: 'todo',
      task: inputValue || '',
      dueDate: null,
    };
    // if (tasks.length > 0 && inputField && tasks[tasks.length - 1].task === '') {
    //   console.log('CANT CREATE TASK');
    //   return;
    // } else {
    setTasks([...tasks, newTask]);
    setInputField(true);
    // }
  };

  const updateTask = (id: Id, taskValue: string, dueDate: Date | null) => {
    const updateTasks = tasks.map((task) => {
      if (task.id !== id)
        return {
          id: task.id,
          columnId: task.columnId,
          type: task.type,
          task: task.task,
          dueDate: task.dueDate,
        };
      return {
        id: task.id,
        columnId: task.columnId,
        type: task.type,
        task: taskValue,
        dueDate: dueDate,
      };
    });
    setTasks(updateTasks);
  };

  // DRAG AND DROP
  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'task-container') {
      setActiveCard(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    // setTasksDone(null);

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

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) {
      return;
    }

    const isActiveTask = active.data.current?.type === 'task-container';
    const isOverTask = over.data.current?.type === 'task-container';

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeTaskId);
        const overIndex = tasks.findIndex((task) => task.id === overTaskId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    // Droping within the TODO list

    // Droping to a DONE list

    // if (active.data.current?.type === 'task-container') {
    //   if (over.data.current?.type === 'task-container') {
    //     return;
    //   }
    //   if (over.data.current?.type === 'done') {
    //     setTasksDone([...tasksDone, active.data.current?.task]);
    //     setTasks((tasks) =>
    //       tasks.filter((task) => task.id !== active.data.current?.task.id)
    //     );
    //   }
    // }
  };

  return (
    <div>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        sensors={sensors}
        id="instanceId">
        <div className=" bg-white rounded-lg p-5 mb-4 shadow-md text-[#545454]">
          <div className="grid grid-cols-2 pb-2">
            <div className="w-2/3 justify-self-center">Task</div>
            <div className="w-1/3 justify-self-center">Due Date</div>
          </div>

          <div className="grid gap-2">
            <SortableContext
              items={tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}>
              {tasks.map((task, idx) => {
                return (
                  <Tasks
                    key={task.id}
                    task={task}
                    createTask={createTask}
                    updateTask={updateTask}
                    removeTask={removeTask}
                    // setInputField={setInputField}
                    lastElement={idx === tasks.length - 1}
                  />
                );
              })}
            </SortableContext>
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
                      // inputValue &&
                      createTask(e, inputValue);
                      setAdding(!adding);
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

        {ReactDOM.createPortal(
          <DragOverlay>
            {activeCard && (
              <Tasks
                task={activeCard}
                createTask={createTask}
                updateTask={updateTask}
                removeTask={removeTask}
                // setInputField={setInputField}
                lastElement={false}></Tasks>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
