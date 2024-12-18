import React from "react";
import './Dropdown.css'

export const Dropdown = ({
  label = "Placeholder",
  id,
  options = [],
  defaultValue = "",
  onChange,
}) => {
  return (
    <div className="dropdown__container">
      <label className="dropdown__label">{label}</label>
      <select
        id={id}
        value={defaultValue}
        onChange={onChange}
        className="dropdown__select"
      >
        <option value="" disabled>
            Select an option
        </option>
        {options.map((option, index) => (
            <option key={index} value={option.value}>
                {option.label}
            </option>
        ))}
      </select>
    </div>
  );
};
