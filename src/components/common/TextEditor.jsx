import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextEditor = ({ placeholder, value, onChange, label, valid, className, required, error,  readOnly = false }) => {

  const toolbarOptions = [
    [{ 'header': ['normal', 1, 2, 3, 4, 5, 6] }, 'bold', 'italic', 'underline', 'strike', 'link', { list: 'ordered' }, { list: 'bullet' }, 'clean'],
  ];

  return (
    <div className={`input_field ${className ? className : ""}`}>
      <label htmlFor={label}>{label}
      {required && <span style={{ color: "red" }}> *</span>} {/* Add * for required fields */}
      </label>
      <ReactQuill
        value={value}
        onChange={readOnly ? () => {} : onChange} // Prevent editing when readOnly
        placeholder={placeholder}
        modules={readOnly ? { toolbar: false } : { toolbar: { container: toolbarOptions } }} // Hide toolbar if readOnly
        readOnly={readOnly} // Set readOnly mode correctly
      />
      <small>{valid}</small>
      {error && <small style={{ color: "red" }}>{error}</small>} {/* Display error message */}
    </div>
  );
};

export default TextEditor;
