import { Box, Button, Grid, TextField } from '@mui/material'
import { Formik } from 'formik'
import React from 'react'
import * as yup from "yup";
import { BlockContent } from '../global';
import MaskTextField from '../MaskTextField';
import { UserAuth } from '../../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateContactForm = ({ setSelected }) => {

    const { user, setUserData } = UserAuth();

    const initialValues = {
        email: '',
        phone: ''
    }

    const contactSchema = yup.object().shape({
        email: yup.string(),
        phone: yup.string().min(14, 'Minimun 14')
    });

    const handleSubmit = (values, {resetForm}) => {
        const updateKeys = Object.keys(values).filter(k => values[k] !== '');
        let insertData = {_id: user._id}
    
        updateKeys.forEach((i) => {
          insertData[i] = values[i];
        });

        axios.post('/updateData', {
            collection: 'contact',
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