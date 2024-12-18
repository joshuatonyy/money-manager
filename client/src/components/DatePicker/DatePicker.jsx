import React, { useEffect, useState } from "react";
import "./DatePicker.css";

const DatePicker = ({ id, label, mode = "picker", value, onChange }) => {
  const isRangeMode = mode === "range";

  const [formattedDate, setFormattedDate] = useState("");
  const [previousValue, setPreviousValue] = useState(value)

  useEffect(() => {
    if (value && mode === "picker") {
      const date = new Date(value);
      const formatted = date.toISOString().split("T")[0];
      setFormattedDate(formatted);
    }
  }, [value]);

  useEffect(() => {
    if (isRangeMode && value) {
      const { start, end } = value;
      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (startDate > endDate) {
          alert("Start date cannot be later than end date.");
          onChange(previousValue); 
        } else {
          setPreviousValue(value); 
        }
      }
    }
  }, [value, isRangeMode, onChange, previousValue]);

  return (
    <div className="datepicker__container">
      <label className="datepicker__label">{label}</label>
      {isRangeMode ? (
        <div className="datepicker__range">
          <div className="datepicker__range-item">
            <label htmlFor={`${id}-start`} className="datepicker__sub-label">
              Start Date{" "}
            </label>
            <input
              type="date"
              id={`${id}-start`}
              value={value?.start || ""}
              onChange={(e) => onChange({ ...value, start: e.target.value })}
              required
            />
          </div>
          <div className="datepicker__range-item">
            <label htmlFor={`${id}-end`} className="datepicker__sub-label">
              End Date{" "}
            </label>
            <input
              type="date"
              id={`${id}-end`}
              value={value?.end || ""}
              onChange={(e) => onChange({ ...value, end: e.target.value })}
              required
            />
          </div>
        </div>
      ) : (
        <input
          type="date"
          id={id}
          className="datepicker__input"
          value={formattedDate || ""}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          required
        />
      )}
    </div>
  );
};

export default DatePicker;
