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
  useSortable,
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
import { type } from 'os';
import { CSS } from '@dnd-kit/utilities';

interface TaskContainerProps {
  type: string;
  columnId: Id;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  tasks: Task[];
  createTask: (
    event: React.MouseEvent | React.KeyboardEvent,
    inputValue?: string,
    date?: Date,
    index?: number
  ) => void;
}

export default function TasksContainer(props: TaskContainerProps) {
  const { type, columnId, setTasks, tasks, createTask } = props;
  // const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  // const [inputField, setInputField] = useState(false); // Input field state when creating new task

  const [tasksDone, setTasksDone] = useState([]);

  const [enableAddBtn, setEnableAddBtn] = useState(true);

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columnId,
    data: {
      type: type,
    },
    disabled: enableAddBtn, // Disable dragging if a task is being added
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // cursor: isDragging ? 'grabbing' : 'pointer', // Change cursor when dragging
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
    console.log(event);
    // Dragging a card from another column
    if (event.active.data.current?.type === 'todo') {
      setActiveCard(event.active.data.current.task);
      return;
    }

    if (event.active.data.current?.type === 'done') {
      setActiveCard(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    console.log(event);
    setActiveCard(null);

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
    console.log(active.data.current?.type, over.data.current?.type);

    if (!isActiveTask && !isOverTask) {
      return;
    }

    console.log(active.data.current?.type, over.data.current?.type);

    // Droping within the TODO list

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        // to find the index
        const activeIndex = tasks.findIndex((task) => task.id === activeTaskId);
        const overIndex = tasks.findIndex((task) => task.id === overTaskId);

        // to change the type
        tasks[overIndex].type = tasks[activeIndex].type;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Droping to a DONE list
    const isOverDone = over.data.current?.type === 'done';

    // if (isActiveTask && isOverDone) {
    //   setTasks((tasks) => {
    //     // to find the index
    //     const activeIndex = tasks.findIndex((task) => task.id === activeTaskId);

    //     // to change the type
    //     tasks[overIndex].type = over.type

    //     return arrayMove(tasks, activeIndex, overIndex);
    //   });
    // }
  };

  if (isDragging) {
    return (
      <div
        className="relative flex text-white bg-[#32a88b] shadow-lg text-base opacity-60 border-2 border-rose-300 h-10 px-4 py-1.5 rounded-lg w-full leading-7 cursor-grab"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}>
      {type === 'todo' && (
        <h2 className="text-xl font-semibold text-center p-4">To do</h2>
      )}
      {type === 'done' && (
        <h2 className="text-xl font-semibold text-center p-4">Done</h2>
      )}
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        sensors={sensors}
        id="instanceId">
        <div className=" bg-white rounded-lg p-5 mb-4 shadow-md text-[#545454]">
          <span style={{ display: type === 'done' ? 'none' : 'block' }}>
            <div className="grid grid-cols-2 pb-2">
              <div className="w-2/3 justify-self-center">Task</div>
              <div className="w-1/3 justify-self-center">Due Date</div>
            </div>
          </span>

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
                    setEnableAddBtn={setEnableAddBtn}
                    lastElement={idx === tasks.length - 1}
                  />
                );
              })}
            </SortableContext>
          </div>
        </div>

        {ReactDOM.createPortal(
          <DragOverlay>
            {activeCard && (
              <Tasks
                key={activeCard.id}
                task={activeCard}
                createTask={createTask}
                updateTask={updateTask}
                removeTask={removeTask}
                // setInputField={setInputField}
                setEnableAddBtn={setEnableAddBtn}
                lastElement={false}></Tasks>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
