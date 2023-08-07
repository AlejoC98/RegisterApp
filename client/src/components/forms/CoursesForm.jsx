import { Box, Button, Grid, InputAdornment, TextField } from '@mui/material'
import { Formik } from 'formik'
import React from 'react'
import * as yup from 'yup';
import { BlockContent } from '../global';
import CurrencyInput from 'react-currency-input-field';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Global } from '../../context/GlobalContext';

const CoursesForm = () => {

  const { updateList } = Global();

  const initialValues = {
    id: '',
    title: '',
    description: '',
    classroom: '',
    capacity: '',
    credits: '',
    cost: ''
  }

  const courseSchema = yup.object().shape({
    id: yup.string().required('This field is requied!'),
    title: yup.string().required('This field is requied!'),
    description: yup.string().required('This field is requied!'),
    classroom: yup.string().required('This field is requied!'),
    capacity: yup.number().required('This field is requied!'),
    credits: yup.number().required('This field is requied!'),
    cost: yup.string().required('This field is requied!'),
  });

  const handleSubmit = (values, {resetForm}) => {
    const insertData = {
      'Course ID': `CSCI-${values.id}`,
      'Course Title': values.title,
      'Course Description': values.description,
      'Classroom Number': `LAB-${values.classroom}`,
      'Capacity': values.capacity,
      'Credit Hours': values.credits,
      'Tuition Cost': values.cost,
    };
    axios.post('/createData', {
      collection: 'courses',
      values: insertData
    }).then((res) => {
      if (res.data.status === true) {
        resetForm();
        updateList('courses', insertData);
        toast.success(res.data.message);
      }
    }).catch((err) => toast.warning(err));
  }

  return (
    <Box flexGrow={1} mt={3} mb={3}>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={courseSchema}
      >
        {({ values, errors, touched, handleChange, handleSubmit, setValues}) => (
          <form onSubmit={handleSubmit}>
            <Box flexGrow={1}>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <BlockContent>
                    <TextField 
                      fullWidth
                      label='Course ID'
                      variant='filled'
                      type='number'
                      name='id'
                      value={values.id}
                      onChange={handleChange}
                      error={!!touched.id && !! !!errors.id}
                      helperText={touched.id && errors.id}
                      onInput={(e)=>{ 
                        e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,4)
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            CSCI-
                          </InputAdornment>
                        )
                      }}
                    />
                  </BlockContent>
                </Grid>
                <Grid item md={6}>
                  <BlockContent>
                    <TextField 
                      fullWidth
                      label='Course Title'
                      variant='filled'
                      type='text'
                      name='title'
                      value={values.title}
                      onChange={handleChange}
                      error={!!touched.title && !! !!errors.title}
                      helperText={touched.title && errors.title}
                    />
                  </BlockContent>
                </Grid>
                <Grid item md={12}>
                  <BlockContent>
                    <TextField 
                      fullWidth
                      label='Course Description'
                      variant='filled'
                      type='text'
                      name='description'
                      value={values.description}
                      onChange={handleChange}
                      error={!!touched.description && !! !!errors.description}
                      helperText={touched.description && errors.description}
                    />
                  </BlockContent>
                </Grid>
                <Grid item md={6}>
                  <BlockContent>
                    <TextField 
                      fullWidth
                      label='Classroom Number'
                      variant='filled'
                      type='number'
                      name='classroom'
                      value={values.classroom}
                      onChange={handleChange}
                      error={!!touched.classroom && !! !!errors.classroom}
                      helperText={touched.classroom && errors.classroom}
                      onInput={(e)=>{ 
                        e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,4)
                      }}
                      InputProps={{
                        inputProps: { maxLength: 4 },
                        startAdornment: (
                          <InputAdornment position='start'>
                            LAB-
                          </InputAdornment>
                        )
                      }}
                    />
                  </BlockContent>
                </Grid> 
                <Grid item md={6}>
                  <BlockContent>
                    <TextField 
                      fullWidth
                      label='Capacity'
                      variant='filled'
                      type='number'
                      name='capacity'
                      value={values.capacity}
                      onChange={handleChange}
                      error={!!touched.capacity && !! !!errors.capacity}
                      helperText={touched.capacity && errors.capacity}
                      onInput={(e)=>{ 
                        e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            #
                          </InputAdornment>
                        )
                      }}
                    />
                  </BlockContent>
                </Grid>
                <Grid item md={6}>
                  <BlockContent>
                    <TextField 
                      fullWidth
                      label='Credit Hours'
                      variant='filled'
                      type='number'
                      name='credits'
                      value={values.credits}
                      onChange={handleChange}
                      error={!!touched.credits && !! !!errors.credits}
                      helperText={touched.credits && errors.credits}
                      onInput={(e)=>{ 
                        e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            #
                          </InputAdornment>
                        )
                      }}
                    />
                  </BlockContent>
                </Grid>
                <Grid item md={6}>
                  <BlockContent>
                    <TextField 
                      fullWidth
                      label='Tuition Cost'
                      variant='filled'
                      type='text'
                      name='cost'
                      // value={values.cost}
                      onChange={handleChange}
                      error={!!touched.cost && !!errors.cost}
                      helperText={touched.cost && errors.cost}
                      InputProps={{
                        inputComponent: CurrencyInput,
                        inputProps: {
                          prefix: '$',
                          decimalsLimit: 2,
                          allowDecimals: 2,
                        }
                      }}
                    />
                  </BlockContent>
                </Grid>
                <Grid item md={12}>
                  <BlockContent>
                    <Button fullWidth variant='contained' color='warning' type='submit'>Create</Button>
                  </BlockContent>
                </Grid>
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  )
}

export default CoursesForm