import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import React, { useState } from "react";

const DynamicSelect = ({
  label,
  options = {},
  id,
  error,
  value,
  name,
  setValues,
  helperText,
  disabled,
  multiple = false
}) => {
  const [selectValue, setSelectValue] = useState(value);
  const handleChange = (event) => {
    const selectedValues = event.target.value;
    setSelectValue(selectedValues);
    if (setValues) {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: selectedValues,
      }));
    }
  };

  const optionsArray = Object.entries(options);

  return (
    <FormControl fullWidth>
      <InputLabel id={`select-comp-${id}-label`} sx={{ textAlign: 'initial'}}>{label}</InputLabel>      
      <Select
        id={id}
        labelId={`select-comp-${id}-label`}
        value={selectValue}
        label={label}
        name={name}
        error={error}
        onChange={handleChange}
        multiple={multiple}
        disabled={disabled}
      >
        {optionsArray.map(([index, value]) => {
          return (
            <MenuItem key={value} value={value}> {index} </MenuItem>
          );
        })}
      </Select>
      <Typography variant="subtitle2" color='error'>{ helperText }</Typography>
    </FormControl>
  );
};

export default DynamicSelect;