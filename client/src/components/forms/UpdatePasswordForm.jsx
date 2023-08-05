import React from 'react';
import { BlockContent } from '../global';
import { Box, Button, Grid, TextField } from '@mui/material';
import * as yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { UserAuth } from '../../context/UserContext';
import { toast } from 'react-toastify';

const UpdatePasswordForm = () => {

    const { user } = UserAuth();

    const initialValues = {
        current_password: '',
        new_password: '',
        confirm_password: ''
    }

    const passwordSchema = yup.object().shape({
        current_password: yup.string().required('This field is required!'),
        new_password: yup.string().min(6, 'Password must be at least 6 characters').required('New password required!'),
        confirm_password: yup.string().oneOf([yup.ref('new_password'), null], 'Passwords must match').required('Confirm Password is required'),
    });

    const handleSubmit = (values, {resetForm}) => {

        values['_id'] = user._id;
        values['username'] = user.username;

        axios.post('/updateData', {
            collection: 'password',
            values: values
        }).then((res) => {
            if (res.data.status) {
                toast.success(res.data.message);
                resetForm();
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
                validationSchema={passwordSchema}
            >
                {({ values, errors, touched, handleSubmit, handleChange, setValues }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item md={4} sm={12} xs={12}>
                                <BlockContent>
                                    <TextField
                                        fullWidth
                                        type='password'
                                        label='Current Password'
                                        value={values.current_password}
                                        name='current_password'
                                        onChange={handleChange}
                                        error={!!touched.current_password && !!errors.current_password}
                                        helperText={touched.current_password && errors.current_password}
                                    />
                                </BlockContent>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <BlockContent>
                                    <TextField
                                        fullWidth
                                        type='password'
                                        label='New Password'
                                        value={values.new_password}
                                        name='new_password'
                                        onChange={handleChange}
                                        error={!!touched.new_password && !!errors.new_password}
                                        helperText={touched.new_password && errors.new_password}
                                    />
                                </BlockContent>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <BlockContent>
                                    <TextField
                                        fullWidth
                                        type='password'
                                        label='Confirm Password'
                                        value={values.confirm_password}
                                        name='confirm_password'
                                        onChange={handleChange}
                                        error={!!touched.confirm_password && !!errors.confirm_password}
                                        helperText={touched.confirm_password && errors.confirm_password}
                                    />
                                </BlockContent>
                            </Grid>
                            <Grid item md={12}>
                                <BlockContent>
                                    <Button variant='contained' color='secondary' type='submit'>Change</Button>
                                </BlockContent>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </Box>
    )
}

export default UpdatePasswordForm