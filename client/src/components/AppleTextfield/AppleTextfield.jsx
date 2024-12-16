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
  initialValue = "",
}) {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(type === "currency" ? formatCurrency(value) : value);
    }
  }, [value]);

  const formatCurrency = (val) => {
    const numericValue = parseFloat(String(val).replace(/[^0-9.]/g, ""));
    if (!isNaN(numericValue)) {
      return `Rp. ${numericValue.toLocaleString("id-ID")}`;
    }
    return "Rp. ";
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (type === "currency") {
      const unformattedValue = newValue.replace(/[^0-9]/g, ""); 
      setInputValue(formatCurrency(unformattedValue));
      if (onChange) onChange({ target: { id, value: unformattedValue } });
    } else {
      setInputValue(newValue);
      if (onChange) onChange(e);
    }
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
