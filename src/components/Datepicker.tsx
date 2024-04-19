import CalendarDaysIcon from '@/icons/CalendarDaysIcon';
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
    },
    onClick: () => {
      console.log('click');
    },
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return (
    <div className="flex items-center relative">
      <div>
        <Datetime
          onChange={(selectedDate) =>
            handleDateChange(selectedDate as unknown as Date)
          }
          closeOnSelect
          value={selectedDate}
          input={true}
          dateFormat="DD/MM/YYYY"
          timeFormat={false}
          inputProps={inputProps}
          className="appearance-none rounded text-gray-700 text-base outline-none focus:outline-none focus:ring-none"
        />
        <div className="h-full text-gray-700 absolute right-0 top-0">
          <CalendarDaysIcon fill="white" />
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
