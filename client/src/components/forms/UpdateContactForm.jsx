import { Box, Button, Grid, TextField } from '@mui/material'
import { Formik } from 'formik'
import React from 'react'
import * as yup from "yup";
import { BlockContent } from '../global';
import MaskTextField from '../MaskTextField';

const UpdateContactForm = () => {

    const initialValues = {
        email: '',
        phone: ''
    }

    const contactSchema = yup.object().shape({
        email: yup.string(),
        phone: yup.string().min(14, 'Minimun 14')
    });

    const handleSubmit = (values) => {
        console.log(values);
    }

  return (
    <Box flexGrow={1}>
        <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={contactSchema}
        >
            {({ values, errors, touched, handleSubmit, handleChange}) => (
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item md={6}>
                            <BlockContent>
                                <TextField
                                    fullWidth
                                    variant='outlined'
                                    type='email'
                                    label='Email'
                                    value={values.email}
                                    name='email'
                                    onChange={handleChange}
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                />
                            </BlockContent>
                        </Grid>
                        <Grid item md={6}>
                            <BlockContent>
                                <MaskTextField
                                    fullWidth
                                    variant='outlined'
                                    type='text'
                                    label='Phone'
                                    value={values.phone}
                                    name='phone'
                                    onChange={handleChange}
                                    error={!!touched.phone && !!errors.phone}
                                    helperText={touched.phone && errors.phone}
                                    mask="(999) 999-9999"
                                    maskChar=''
                                />
                            </BlockContent>
                        </Grid>
                        <Grid item md={12}>
                            <BlockContent>
                                <Button disabled={values.email === '' && values.phone === ''} variant='contained' color='secondary' type='submit'>Update</Button>
                            </BlockContent>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Formik>
    </Box>
  )
}

export default UpdateContactForm