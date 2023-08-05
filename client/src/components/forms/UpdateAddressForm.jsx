import { Box, Grid } from '@mui/material'
import { Formik } from 'formik'
import React from 'react'
import * as yup from "yup";
import { BlockContent, handleDynamicData, usStates } from '../global';
import DynamicSelect from '../DynamicSelect';

const UpdateAddressForm = () => {
  
  const countryData = handleDynamicData([{country: 'United State', code: 'US'}], 'country', 'code');
  const stateData = handleDynamicData(usStates, 'name', 'code');
  
  const initialValues = {
    country: '',
    city: '',
    state: '',
    street: '',
    zipcode: ''
  }

  const addressSchema = yup.object().shape({
    country: yup.string(),
    city: yup.string(),
    state: yup.string(),
    street: yup.string(),
    zipcode: yup.string()
  });

  const handleSubmit = (values) => {
    console.log(values);
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
                  <DynamicSelect
                    fullWidth
                    options={countryData}
                    multiple={false}
                    disabled={false}
                    setValues={setValues}
                    label='Country'
                    variant='outlined'
                    type='text'
                    name='country'
                    onChange={handleChange}
                    value={values.country}
                    error={!!touched.country && !!errors.country}
                    helperText={touched.country && errors.country}
                  />
                </BlockContent>
              </Grid>
              <Grid item md={6}>
                <BlockContent>
                  <DynamicSelect
                    fullWidth
                    options={stateData}
                    multiple={false}
                    disabled={false}
                    setValues={setValues}
                    label='State'
                    variant='outlined'
                    type='text'
                    name='state'
                    onChange={handleChange}
                    value={values.state}
                    error={!!touched.state && !!errors.state}
                    helperText={touched.state && errors.state}
                  />
                </BlockContent>
              </Grid>
              <Grid item md={6}>
                <BlockContent>
                  <TextField
                        fullWidth
                        variant='filled'
                        type='email'
                        label='Email'
                        value={values.email}
                        name='email'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={!!touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                    />
                </BlockContent>
              </Grid>
              <Grid item md={6}>
                <BlockContent>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur praesentium natus obcaecati odio. Dicta sunt, nobis, sit nemo a voluptatem voluptate in vitae fugiat accusamus et asperiores aut neque earum?
                </BlockContent>
              </Grid>
              <Grid item md={6}>
                <BlockContent>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur praesentium natus obcaecati odio. Dicta sunt, nobis, sit nemo a voluptatem voluptate in vitae fugiat accusamus et asperiores aut neque earum?
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