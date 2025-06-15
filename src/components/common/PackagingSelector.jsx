import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CheckBox from "./CheckBox";

const PackagingSelector = ({ onSelect, selectedValues }) => {
  const packagingOptions = [
    {
      type: "cargoboard",
      subtypes: ["Euro Pallet", "Half Pallet", "One Way"],
    },
    {
      type: "dpd",
      subtypes: ["L max", "S max", "XL max", "XXL"],
    },
    {
      type: "Can not be shipped, only for local delivery",
      subtypes: [],
    },
  ];

  

  const [selectedType, setSelectedType] = useState(selectedValues?.type || null);
  const [selectedSubtype, setSelectedSubtype] = useState(selectedValues?.subType || null);

  useEffect(() => {
    setSelectedType(selectedValues?.type || null);
    setSelectedSubtype(selectedValues?.subtypes || null);
  }, [selectedValues]);
  

  const handleTypeChange = (type) => {
    const newType = selectedType === type ? null : type;
    setSelectedType(newType);
    setSelectedSubtype(null);
    if (onSelect) onSelect(newType, null);
  };

  const handleSubtypeChange = (subtype) => {
    const newSubtype = selectedSubtype === subtype ? null : subtype;
    setSelectedSubtype(newSubtype);
    if (onSelect) onSelect(selectedType, newSubtype);
  };

  const currentSubtypes = selectedType
    ? packagingOptions.find((option) => option.type === selectedType).subtypes
    : [];

  return (
    <div className="sidebar_checkboxes">
      <div className="packaginTypeDiv" role="group" aria-label="Packaging Types">
        {packagingOptions.map((option) => (
          <CheckBox
            key={option.type}
            type="radio"
            label={option.type}
            value={option.type}
            isChecked={selectedType === option.type}
            onChange={() => handleTypeChange(option.type)}
            aria-label={`Select ${option.type}`}
          />
        ))}
      </div>

      {selectedType && (
        <div className="packaginTypeSubDiv" role="group" aria-label="Packaging Subtypes">
          <span className="sub_heading">Subtypes for {selectedType}</span>
          {currentSubtypes.map((subtype) => (
            <CheckBox
              key={subtype}
              type="radio"
              label={subtype}
              value={subtype}
              isChecked={selectedSubtype === subtype}
              onChange={() => handleSubtypeChange(subtype)}
              aria-label={`Select ${subtype}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

PackagingSelector.propTypes = {
  onSelect: PropTypes.func,
  selectedValues: PropTypes.shape({
    type: PropTypes.string,
    subType: PropTypes.string,
  }),
};

PackagingSelector.defaultProps = {
  onSelect: () => {},
  selectedValues: { type: null, subType: null },
};

export default PackagingSelector;