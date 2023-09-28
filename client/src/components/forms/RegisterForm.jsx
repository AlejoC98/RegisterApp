import { Avatar, Box, Button, Grid, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import { BlockContent } from '../../components/global';
import { Formik } from 'formik';
import * as yup from "yup";
import axios from "axios";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MaskTextField from '../../components/MaskTextField';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/UserContext';
import { Global } from '../../context/GlobalContext';

const RegisterForm = ({ type }) => {

    const { user } = UserAuth();
    const { updateList } = Global();

    const initialValues = {
        firstname: '',
        lastname: '',
        username: '',
        ...(type !== undefined && {
            role: type,
        }),
        password: '',
        confirmPassword: '',
        dob: '',
        email: '',
        phone: '',
        address: '',
        status: 'Pending'
    }

    const registerSchema = yup.object().shape({
        firstname: yup.string().required('This field is required!'),
        lastname: yup.string().required('This field is required!'),
        username: yup.string().required('This field is required!'),
        ...(type !== undefined && {
            role: yup.number().required('This field is required!'),
        }),
        password: yup.string().min(6, 
            'Password must be at least 6 characters').required('Password required!'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 
            'Passwords must match').required('Confirm Password is required'),
        dob: yup.string().required('This field is required!'),
        email: yup.string().required('This field is required!'),
        phone: yup.string().required('This field is required!'),
        address: yup.string().required('This field is required!'),
    });

    const fileInputRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    // Functions
    const handleSubmit = (values, { resetForm }) => {

        values.dob = typeof values.dob === 'object' ? values.dob.$d.toLocaleDateString('en-US', { dateStyle: 'short' }) : values.dob;

        const formData = new FormData();
        Object.keys(values).forEach(key => {
            formData.append(key, values[key]);
        });
        
        formData.append('creator_role', user !== undefined ? user.role : 0);

        axios.post('/auth/register', formData).then((res) => {
            resetForm();
            if (user.role === 1) {
                updateList(values.role === 3 ? 'students' : 'teachers', values);
            } else {
                if (type === undefined) {
                    navigate('/Login');
                }
            }
            setTimeout(() => {
                toast.success(res.data.message);
            }, 100);
        }).catch((err) => toast.warning(err.response.data.message));
    }

    const handleOpenFile = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = async (newFile, setValues) => {
        const imageFile = newFile.target.files[0];
        setProfile(URL.createObjectURL(imageFile));

        setValues((prevValues) => ({
            ...prevValues,
            profile: imageFile,
        }));
    }

    return (
        <Box>
            <Formik
                onSubmit={handleSubmit}
                initialValues={initialValues}
                validationSchema={registerSchema}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setValues }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <BlockContent sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Avatar sx={{ width: 120, height: 120, '&:hover': { cursor: 'pointer' } }} src={profile} alt='Profile' onClick={handleOpenFile} />
                                    <input hidden type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e, setValues)} />
                                </BlockContent>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <BlockContent>
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='text'
                                        label='Firstname'
                                        value={values.firstname}
                                        name='firstname'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.firstname && !!errors.firstname}
                                        helperText={touched.firstname && errors.firstname}
                                        inputProps={{ style: { textTransform: "capitalize" } }}
                                    />
                                </BlockContent>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <BlockContent>
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='text'
                                        label='Lastname'
                                        value={values.lastname}
                                        name='lastname'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.lastname && !!errors.lastname}
                                        helperText={touched.lastname && errors.lastname}
                                        inputProps={{ style: { textTransform: "capitalize" } }}
                                    />
                                </BlockContent>
                            </Grid>
                            { type && (
                                <Grid item md={12}>
                                    <BlockContent>
                                       <TextField 
                                            fullWidth
                                            variant='filled'
                                            type='text'
                                            label='Role'
                                            disabled
                                            value={type === 3 ? 'Student' : type === 2 ? 'Teacher' : values.role}
                                            name='role'
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={!!touched.role && !!errors.role}
                                            helperText={touched.role && errors.role}
                                       />
                                    </BlockContent>
                                </Grid>
                            )}
                            <Grid item xs={12} md={6}>
                                <BlockContent>
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='text'
                                        label='Username'
                                        value={values.username}
                                        name='username'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.username && !!errors.username}
                                        helperText={touched.username && errors.username}
                                    />
                                </BlockContent>
                            </Grid>
                            <Grid item xs={12} md={6}>
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
                            <Grid item xs={12} md={6}>
                                <BlockContent>
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='password'
                                        label='Password'
                                        value={values.password}
                                        name='password'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.password && !!errors.password}
                                        helperText={touched.password && errors.password}
                                    />
                                </BlockContent>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <BlockContent>
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='password'
                                        label='Confirm Password'
                                        value={values.confirmPassword}
                                        name='confirmPassword'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.confirmPassword && !!errors.confirmPassword}
                                        helperText={touched.confirmPassword && errors.confirmPassword}
                                    />
                                </BlockContent>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <BlockContent>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker
                                                label="Date Of Birth"
                                                name='dob'
                                                onBlur={handleBlur}
                                                onChange={(newDate) => setValues((prevValues) => ({
                                                    ...prevValues,
                                                    dob: newDate,
                                                }))}
                                                slotProps={{
                                                    textField: {
                                                        variant: 'filled',
                                                        value: values.dob,
                                                        error: !!touched.dob && !!errors.dob,
                                                        helperText: touched.dob && errors.dob
                                                    }
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </BlockContent>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <BlockContent>
                                    <MaskTextField
                                        fullWidth
                                        variant='filled'
                                        type='text'
                                        label='Phone'
                                        value={values.phone}
                                        name='phone'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.phone && !!errors.phone}
                                        helperText={touched.phone && errors.phone}
                                        mask="(999) 999-9999"
                                    />
                                </BlockContent>
                            </Grid>
                            <Grid item sm={12}>
                                <BlockContent>
                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        type='text'
                                        label='Address'
                                        value={values.address}
                                        name='address'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        error={!!touched.address && !!errors.address}
                                        helperText={touched.address && errors.address}
                                    />
                                </BlockContent>
                            </Grid>
                        </Grid>
                        <Button fullWidth variant='contained' size='large' className='btn-login' type='submit'>Register</Button>
                    </form>
                )}
            </Formik>
        </Box>
    )
}

export default RegisterForm