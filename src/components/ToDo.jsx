'use client';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Generate unique IDs
import Image from 'next/image';

const ToDo = () => {
  const [tasks, setTask] = useState([{ id: uuidv4() }]);

  const addTaskFn = (e, index) => {
    if (e.key === 'Enter') {
      if (index === tasks.length - 1) {
        setTask([...tasks, { id: uuidv4() }]);
      }
    } else {
      setTask([...tasks, { id: uuidv4() }]);
    }
  };

  return (
    <div>
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
                    {tasks.map(({ id }, index) => {
                      return (
                        <tr
                          key={id}
                          className="relative grid grid-cols-[3fr_1fr] text-white bg-[#32a88b] shadow-lg text-base  px-4 py-1.5 rounded-lg w-full leading-7">
                          <td className="w-full">
                            <input
                              type="text"
                              placeholder="Task name"
                              className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0 placeholder:text-gray-100"
                              autoFocus="true"
                              onKeyUp={(e) =>
                                e.key === 'Enter' && addTaskFn(e, index)
                              }
                            />
                            <span
                              className="absolute w-20 h-20 -right-16 -top-2 group"
                              onClick={() =>
                                setTask(tasks.filter((task) => task.id !== id))
                              }>
                              <Image
                                src="close-circle-outline.svg"
                                alt="close icon"
                                width={20}
                                height={20}
                                className="w-1/3 invisible group-hover:visible"
                              />
                            </span>
                          </td>
                          <td>
                            <input
                              className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0"
                              type="date"
                              id="due-date"
                              placeholder="Choose a due date"
                              required
                            />
                          </td>
                        </tr>
                      );
                    })}

                    <tr className="flex justify-between text-white bg-[#32a88b] shadow-lg text-base  px-4 py-1.5 rounded-lg w-full leading-7">
                      <td className="w-full">
                        <button
                          type="text"
                          className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0 placeholder:text-gray-100"
                          onClick={(e, index) => addTaskFn(e, index)}>
                          Add a new task +
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-center p-4">Done</h2>
            <div className="grid grid-rows-[auto_auto] bg-white rounded-lg p-5 mb-4 shadow-md">
              <div className="text-[#545454]">
                <ul className="">
                  <li>First task</li>
                  <li>Second task</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <button className="text-white bg-[#32a88b] hover:bg-sky-600 shadow-lg text-base  px-4 py-1.5 rounded-lg w-44 justify-self-end leading-7">
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

export default ToDo;
