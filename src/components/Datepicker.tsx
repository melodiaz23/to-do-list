import CalendarDaysIcon from '@/icons/CalendarDaysIcon';
import { Task } from '@/types';
import React, { useEffect, useState } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

interface DatepickerProps {
  task: Task;
  updateTask: (id: string, task: string | null, dueDate: Date | null) => void;
  setEditMode: (editMode: boolean) => void;
}
const DatePicker = (props: DatepickerProps) => {
  const { task, updateTask, setEditMode } = props;

  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(task.dueDate || new Date())
  );

  const inputProps = {
    placeholder: 'Choose a due date',
    id: task.id.toString(),
    style: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      width: '100%',
    },
    onClick: () => {
      console.log('click');
    },
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    updateTask(task.id.toString(), task.task, newDate);
    setEditMode(true);
  };

  return (
    <div className="flex items-center relative ">
      <div className="">
        <Datetime
          onChange={(selectedDate) => {
            handleDateChange(selectedDate as unknown as Date);
          }}
          closeOnSelect
          value={selectedDate}
          input={true}
          dateFormat="DD/MM/YYYY"
          timeFormat={false}
          inputProps={inputProps}
          className="appearance-none rounded text-gray-700 text-base outline-none focus:outline-none focus:ring-none md:mr-5"
        />
        <div className="absolute h-full text-gray-700 -right-1 md:-right-2 top-0">
          <CalendarDaysIcon fill="white" />
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
