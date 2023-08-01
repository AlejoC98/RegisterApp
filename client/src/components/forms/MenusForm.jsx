import * as yup from 'yup';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { BlockContent, handleRolesSelectData } from '../global';
import { Global } from '../../context/GlobalContext';
import DynamicSelect from '../DynamicSelect';
import SearchIconField from '../SearchIconField';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingButton from "@mui/lab/LoadingButton";

const MenuForm = () => {

  const { roles, updateList } = Global();
  const selectRoles = handleRolesSelectData(roles);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    name: '',
    icon: '',
    to: '/',
    role: []
  }

  const MenuSchema = yup.object().shape({
    name: yup.string().required('This field is required!'),
    icon: yup.string().required('This field is required!'),
    to: yup.string().required('This field is required!'),
    role: yup.array().required('This field is required!'),
  });

  const handleSubmit = (values, {resetForm}) => {
    setLoading(true);
    axios.post('/createData', {
      collection: 'menus',
      values: values
    }).then((res) => {
      if (res.data.status === true) {
        updateList('roles', values);
        resetForm();
        setLoading(false);
        toast.success(res.data.message);
      }
      console.log(res.data);
    }).catch((err) => {
      setLoading(false);
      toast.error(err);
    });
  }

  function handleLink(event, setValues) {
    const inputValue = event.target.value;
    if (!inputValue.startsWith("/")) {
      setValues((prevValues) => ({
        ...prevValues,
        to: `/${event.target.value}`,
      }));
    }
  }
  
  return (
    <Box flexGrow={1} pt={5}>
      <Typography variant='h4'>New Menu</Typography>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={MenuSchema}
      >
        {
        ({ values, errors, touched, handleChange, handleSubmit, handleBlur, setValues }) => (
          <form onSubmit={handleSubmit}>
            <Box flexGrow={1} mt={5} mb={5} pl={15} pr={15}>
              <Grid container spacing={2}>
                <Grid item md={6} sm={12}>
                  <BlockContent>
                    <TextField
                      fullWidth
                      label='Name'
                      variant='outlined'
                      type='text'
                      name='name'
                      value={values.name}
                      disabled={loading}
                      onChange={handleChange}
                      error={!!touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </BlockContent>
                </Grid>
                <Grid item md={6} sm={12}>
                  <BlockContent>
                    <SearchIconField 
                      id='search-icons'
                      label='Icon'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.icon}
                      name='icon'
                      setValues={setValues}
                      disabled={loading}
                      error={!!touched.icon && !!errors.icon}
                      helperText={touched.icon && errors.icon}
                    />
                  </BlockContent>
                </Grid>
                <Grid item md={6} sm={12}>
                  <BlockContent>
                    <TextField
                      fullWidth
                      label='Link To'
                      variant='outlined'
                      type='text'
                      name='to'
                      onChange={ (e) => {
                        handleChange(e);
                        handleLink(e, setValues);
                      }}
                      value={values.to}
                      disabled={loading}
                      error={!!touched.to && !!errors.to}
                      helperText={touched.to && errors.to}
                    />
                  </BlockContent>
                </Grid>
                <Grid item md={6} sm={12}>
                  <BlockContent>
                    <DynamicSelect 
                      fullWidth
                      options={selectRoles}
                      multiple={true}
                      setValues={setValues}
                      label='Role'
                      variant='outlined'
                      type='text'
                      name='role'
                      onChange={handleChange}
                      value={values.role}
                      disabled={loading}
                      error={!!touched.role && !!errors.role}
                      helperText={touched.role && errors.role}
                    />
                  </BlockContent>
                </Grid>
                <Grid item md={12} sx={{ mt: 3}}>
                  { loading ? (
                    <LoadingButton
                      size="medium"
                      fullWidth
                      loading
                      variant="outlined"
                    >
                      Creating...
                    </LoadingButton>
                  ) : (
                    <Button variant='outlined' size='large' color='primary' type='submit'>Create</Button>
                  )}
                </Grid>
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  )
}

export default MenuForm