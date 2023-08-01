import { TextField } from '@mui/material';
import React from 'react';
import InputMask from 'react-input-mask';

const MaskTextField = (props) => {
  return (
    <InputMask {...props}>
        {(inputProps) => (
            <TextField
                fullWidth
                {...inputProps}
            />
        )}
    </InputMask>
  )
}

export default MaskTextField