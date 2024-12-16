import React, { useState, useEffect } from "react";
import "./AppleTextfield.css";

function AppleTextfield({ 
  id, 
  label, 
  type = "text", 
  value, 
  onChange, 
  required = false, 
  className = "", 
  initialValue = "" 
}) {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) onChange(e);
  };

  return (
    <div className={`entry ${className}`}>
      <input
        id={id}
        type={type}
        required={required}
        className="input"
        value={inputValue}
        onChange={handleChange}
      />
      <label
        htmlFor={id}
        className={`entry-label ${inputValue ? "active" : ""}`}
      >
        {label}
      </label>
    </div>
  );
}

export default AppleTextfield;
