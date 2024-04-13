const DatePicker = () => {
  const today = new Date();
  const utcDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  const defaultDate = utcDate.toISOString().slice(0, 10);

  return (
    <div>
      <input
        className="w-full border-0 bg-[#32a88b] text-white border-[#32a88b] outline-0 "
        type="date"
        id="due-date"
        placeholder="Choose a due date"
        required
        defaultValue={defaultDate}
      />
    </div>
  );
};

export default DatePicker;
