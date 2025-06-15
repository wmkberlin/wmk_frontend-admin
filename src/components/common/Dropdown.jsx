import React, { useState, useEffect } from 'react';
import * as Icons from "react-icons/tb";

const Dropdown = ({ className, placeholder, onClick, options, selectedValue, type, value, icon, label, valid, required, name , error}) => {
  const [dropdown, setDropdown] = useState(false);

  // Find the selected label based on the selectedValue
  const selectedLabel = options.find((option) => option.value === selectedValue)?.label || selectedValue || placeholder;

  const handleOptionClick = (option) => {
    if (onClick) {
      onClick(option);
    }
    setDropdown(false);
  };

  const handleDropdown = () => {
    setDropdown(!dropdown);
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (dropdown && e.target.closest('.dropdown') === null) {
        setDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [dropdown]);

  return (
    <div className={`input_field ${className ? className : ""}`}>
      {label && <label htmlFor={label}>{label}
      {required && <span style={{ color: "red" }}> *</span>} {/* Add * for required fields */}
        </label>}
      <div className="input_field_wrapper">
        {icon && <label htmlFor={label} className={`input_icon`}>{icon}</label>}
        <div className={`dropdown ${className ? className : ""}`}>
          <span onClick={handleDropdown} className="dropdown_placeholder">
            {selectedLabel} {/* Display the label instead of the value */}
            <Icons.TbChevronDown />
          </span>
          <ul className={`${dropdown ? "active" : ""} dropdown_options`}>
            {options.map((option, key) => (
              <li key={key} onClick={() => handleOptionClick(option)}>
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {valid && <small>{valid}</small>}
      {error && <small style={{ color: "red" }}>{error}</small>} {/* Display error message */}
    </div>
  );
};

export default Dropdown;