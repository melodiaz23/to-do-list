// const DatePicker = () => {
//   const today = new Date();
//   const utcDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
//   const defaultDate = utcDate.toISOString().slice(0, 10);

//   return (
//     <div>
//       <input
//         className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0 exception-element"
//         type="date"
//         id="due-date"
//         placeholder="Choose a due date"
//         required
//         defaultValue={defaultDate}
//       />
//     </div>
//   );
// };

// export default DatePicker;

import CalendarDaysIcon from '@/icons/CalendarDaysIcon';
import moment from 'moment';
import React, { useState } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const inputProps = {
    placeholder: 'Choose a due date',
    style: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      width: '100%',
      '&:focus': {
        backgroundColor: 'red',
        outline: 'none',
      },
    },
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return (
    <div className="flex items-center relative">
      <Datetime
        onChange={(selectedDate) => handleDateChange(selectedDate)}
        closeOnSelect
        value={selectedDate}
        input={true}
        dateFormat="DD/MM/YYYY"
        timeFormat={false}
        inputProps={inputProps}
        className="appearance-none rounded text-gray-700 text-base ring-green-400 focus:ring-none"
      />
      <span className="h-full text-gray-700 absolute right-0 top-0">
        <CalendarDaysIcon fill="white" />
      </span>
    </div>
  );
};

export default DatePicker;
