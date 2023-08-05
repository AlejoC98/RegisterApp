import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { useState } from "react";

const AutoComplete = ({
  id,
  label,
  value,
  name,
  error,
  setValues,
  helperText,
  onChange,
  options
}) => {

  const [selectValue, setSelectValue] = useState(value);

  const handleAutocompleteChange = (event, selectedOption) => {
    setSelectValue(event.currentTarget.textContent);
    setValues((prevValues) => ({
      ...prevValues,
      [name]: selectedOption,
    }));
  };

  return (
    <Autocomplete
      fullWidth
      disablePortal
      id={id}
      options={options}
      renderOption={(props, option) => (
        <Box {...props} display="flex" width="100%" justifyContent="space-around">
          <Typography>{option}</Typography>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          onChange={onChange}
          error={error}
          helperText={helperText}
          value={selectValue}
          name={name}
        />
      )}
      onChange={handleAutocompleteChange}
    />
  );
};

export default AutoComplete;