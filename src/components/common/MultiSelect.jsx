import React, { useState, useRef, useEffect } from "react";
import * as Icons from "react-icons/tb";

const MultiSelect = ({
  className,
  label,
  options,
  placeholder,
  isSelected,
  isMulti = false,
  onChange,
}) => {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState([]); // Initialize as empty array
  const [bool, setBool] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSelected) {
      const formattedSelected = isSelected.map((item) => ({
        label: item.title || item.name, // Use `title` as the label
        value: item._id, // Use `_id` as the value
      }));
      setSelected(formattedSelected);
    }
  }, [isSelected]);

  
  const selectedHandle = (option) => {
    if (!isMulti) {
      setSelected([{ label: option.handle || option.title  || item.name, value: option._id }]); // Store both label and value
      setBool(false);
      setValue("");
      setFilteredOptions(options);
    } else {
      setSelected((prevSelected) => [
        ...prevSelected,
        { label: option.handle || option.title  || item.name, value: option._id }, // Store both label and value
      ]);
      setBool(false);
      setValue("");
      setFilteredOptions(options);
    }
    // Pass the selected option's value (_id) to the parent
    onChange(
      isMulti
        ? [...selected.map((s) => s.value), option._id] // Use the stored value (_id)
        : [option._id]
    );
  };

  const inputClickHandle = () => {
    setBool(!bool);
  };

  const changeHandler = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleOutsideClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setBool(false);
    }
  };

  const removeTagHandle = (tag) => {
    // Remove the tag from the selected state
    const updatedSelected = selected.filter(
      (selectedValue) => selectedValue.label !== tag
    );
    setSelected(updatedSelected);
    setFilteredOptions(options);

    // Update the onChange callback with the new list of selected values (_id's)
    const updatedIds = updatedSelected.map((s) => s.value);
    onChange(updatedIds);
  };

  const clearAllHandle = () => {
    setSelected([]);
    setFilteredOptions(options);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      className={`multi_select input_field ${className ? className : ""}`}
      ref={inputRef}
    >
      {label ? <label>{label}</label> : ""}
      <div className="selected_tags">
        {isMulti &&
          selected.map((select, key) => (
            <span
              key={key}
              className={`${!isMulti ? "selected_tag single" : "selected_tag"}`}
            >
              {select.label}
              {!isMulti ? (
                ""
              ) : (
                <Icons.TbX
                  className="remove_tags"
                  onClick={() => removeTagHandle(select.label)}
                />
              )}
            </span>
          ))}
      </div>
      <div className="multi_input">
        {!isMulti && selected.length === 0 ? (
          <input
            type="text"
            className={bool ? "active" : ""}
            placeholder={placeholder}
            value={value}
            onChange={changeHandler}
            onClick={inputClickHandle}
          />
        ) : isMulti ? (
          <input
            type="text"
            className={bool ? "active" : ""}
            placeholder={placeholder}
            value={value}
            onChange={changeHandler}
            onClick={inputClickHandle}
          />
        ) : (
          <span className="default_select">{selected[0]?.label}</span>
        )}
        <Icons.TbChevronDown className="chevron_down" />
        {selected.length !== 0 ? (
          <Icons.TbX className="remove_tags" onClick={clearAllHandle} />
        ) : null}
      </div>
      <ul className={`select_dropdown ${bool ? "active" : ""}`}>
        {options.map((option, key) => {
          const isOptionSelected = selected.some(
            (selectedOption) => selectedOption.value === option._id
          );
          return (
            <li
              key={key}
              className={`select_dropdown_item ${
                isOptionSelected ? "disabled" : ""
              }`}
              onClick={() => !isOptionSelected && selectedHandle(option)}
            >
              <button>{option.handle || option.title  || item.name}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MultiSelect;