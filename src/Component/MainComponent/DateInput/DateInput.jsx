import React, { useEffect } from "react";

const DateInput = ({
  dateValue,
  setDateValue,
  handleEnterKeyPress,
  nextRef,
  inputRef,
}) => {
  useEffect(() => {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    if (!dateValue) {
      const today = new Date();
      setDateValue(formatDate(today)); // Set default date format
    }
  }, [dateValue, setDateValue]);

  return (
    <input
      style={{ height: "24px", marginLeft: "-10px" }}
      type="date"
      className="col-12"
      value={dateValue}
      ref={inputRef}
      onKeyDown={(e) => handleEnterKeyPress(nextRef, e)}
      onChange={(e) => setDateValue(e.target.value)} // Update parent state on change
    />
  );
};

export default DateInput;
