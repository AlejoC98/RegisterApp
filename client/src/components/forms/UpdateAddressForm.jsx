import { Box, Button, Grid, TextField } from '@mui/material'
import { Formik } from 'formik'
import React from 'react'
import * as yup from "yup";
import { BlockContent, usStates, countries } from '../global';
import { UserAuth } from '../../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import AutoComplete from '../AutoComplete';

const UpdateAddressForm = ({ setSelected }) => {

  const { user, setUserData } = UserAuth();

  const initialValues = {
    country: '',
    city: '',
    state: '',
    address: '',
    zipcode: ''
  }

  const addressSchema = yup.object().shape({
    country: yup.string(),
    city: yup.string(),
    state: yup.string(),
    address: yup.string(),
    zipcode: yup.string()
  });

  const handleSubmit = (values, {resetForm}) => {
    const updateKeys = Object.keys(values).filter(k => values[k] !== '');
    let insertData = {_id: user._id}

    updateKeys.forEach((i) => {
      insertData[i] = values[i];
    });

    axios.post('/updateData', {
      collection: 'address',
      values: insertData
    }).then((res) => {
      if (res.data.status) {
        toast.success(res.data.message);
        resetForm();
        let newUserData = {...user,...insertData};
        setUserData(newUserData);
        setSelected('My Profile');
      }
    }).catch((err) => {
      toast.warning(err.response.data.message);
    });
  }

  return (
    <Box flexGrow={1}>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={addressSchema}
      >
        {({ values, errors, touched, handleSubmit, handleChange, setValues}) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <BlockContent>
                  <AutoComplete 
                    fullWidth
                    id='country'
                    name='country'
                    label='Country'
                    value={values.country}
                    setValues={setValues}
                    error={!!touched.country && !!errors.country}
                    helperText={touched.country && errors.country}
                    onChange={handleChange}
                    options={
                      countries.reduce((accumulator, currentObject) => {
                        accumulator.push({text: currentObject.country, value: currentObject.country});
                        return accumulator;
                      }, [])
                    }
                  />
                </BlockContent>
              </Grid>
              <Grid item md={6}>
                <BlockContent>
                  <AutoComplete 
                    fullWidth
                    id='state'
                    name='state'
                    label='State'
                    value={values.state}
                    setValues={setValues}
                    error={!!touched.state && !!errors.state}
                    helperText={touched.state && errors.state}
                    onChange={handleChange}
                    options={
                      usStates.reduce((accumulator, currentObject) => {
                        accumulator.push({text: currentObject.name, value: currentObject.name});
                        return accumulator;
                      }, [])
                    }
                  />
                </BlockContent>
              </Grid>
              <Grid item md={6}>
                <BlockContent>
                  <TextField
                        fullWidth
                        variant='outlined'
                        type='text'
                        label='City'
                        value={values.city}
                        name='city'
                        onChange={handleChange}
                        error={!!touched.city && !!errors.city}
                        helperText={touched.city && errors.city}
                    />
                </BlockContent>
              </Grid>
              <Grid item md={6}>
                <BlockContent>
                <TextField
                        fullWidth
                        variant='outlined'
                        type='text'
                        label='Zipcode'
                        value={values.zipcode}
                        name='zipcode'
                        onChange={handleChange}
                        error={!!touched.zipcode && !!errors.zipcode}
                        helperText={touched.zipcode && errors.zipcode}
                    />
                </BlockContent>
              </Grid>
              <Grid item md={12}>
                <BlockContent>
                <TextField
                        fullWidth
                        variant='outlined'
                        type='text'
                        label='Street'
                        value={values.address}
                        name='address'
                        onChange={handleChange}
                        error={!!touched.address && !!errors.address}
                        helperText={touched.address && errors.address}
                    />
                </BlockContent>
              </Grid>
              <Grid item md={12}>
                <BlockContent>
                <Button disabled={values.country === '' && values.city === '' && values.state === '' && values.address === '' && values.zipcode === ''} variant='contained' color='secondary' type='submit'>Update</Button>
                </BlockContent>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Box>
  )
}

export default UpdateAddressForm