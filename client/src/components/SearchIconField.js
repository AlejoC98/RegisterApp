import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import * as icons from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getIconComponent } from "./global";

const SearchIconField = ({
  id,
  label,
  handleBlur,
  error,
  helperText,
  value,
  onChange,
  name,
  setValues,
  disabled
}) => {

  const [selectValue, setSelectValue] = useState(value);

  const handleAutocompleteChange = (event, selectedOption) => {
    setSelectValue(event.currentTarget.textContent);
    setValues((prevValues) => ({
      ...prevValues,
      [name]: selectedOption,
    }));
  };

  const [iconsData, setIconsData] = useState([]);
  useEffect(() => {
    const exceptions = ['Outlined', 'Filled', 'Sharp', 'TwoTone'];
    const iconsList = [];
    Object.keys(icons).forEach((icon) => {
      let hasAnyWord = exceptions.some((word) => icon.includes(word) || icon.indexOf('Rounded') === -1);
      if (!hasAnyWord) {
        iconsList.push(icon);
      }
    });

    setIconsData(iconsList);
  }, []);

  return (
    <Autocomplete
      fullWidth
      disablePortal
      id={id}
      options={iconsData}
      renderOption={(props, option) => (
        <Box {...props} display="flex" width="100%" justifyContent="space-around">
          <Typography>{option}</Typography>
          {getIconComponent(option)}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          onBlur={handleBlur}
          onChange={onChange}
          error={error}
          helperText={helperText}
          value={selectValue}
          name={name}
          disabled={disabled}
        />
      )}
      onChange={handleAutocompleteChange}
    />
  );
};

export default SearchIconField;