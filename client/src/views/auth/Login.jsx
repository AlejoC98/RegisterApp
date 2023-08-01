import React from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import * as yup from 'yup';
import { Formik } from "formik";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserAuth } from '../../context/UserContext';

const Login = () => {

    const navigate = useNavigate();

    const { setUserData, setUserToken} = UserAuth()

    const initialValues = {
        username: '',
        password: ''
    }

    const loginSchema = yup.object().shape({
        username: yup.string().required('This field is required'),
        password: yup.string().required('This field is required')
    });

    const handleSubmit = (values) => {
        axios.post('/auth/login', values).then((res) => {
            if ('user' in res.data) {
                setUserData(res.data.user);
                setUserToken(true);
                navigate('/Dashboard');
                setTimeout(() => {
                    toast.success(res.data.message);
                }, 200);
            }
        }).catch((err) => toast.warning(err.response.data.message));
    }

  return (
    <Box className="auth-box">
        <Typography variant='h2' sx={{ textAlign: 'center', margin: '15px 0'}} className='auth-title' >Login</Typography>
        <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={loginSchema}
        >
            {( {values, errors, touched, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit} className='login-form'>
                    <TextField 
                        fullWidth
                        label='Username'
                        variant='standard'
                        type='text'
                        name='username'
                        onChange={handleChange}
                        value={values.username}
                        error={!!touched.username && !!errors.username}
                        helperText={touched.username && errors.username}
                        inputProps={{ style: { textTransform: "capitalize" } }}
                    />
                    <TextField 
                        fullWidth
                        label='Password'
                        variant='standard'
                        type='password'
                        name='password'
                        onChange={handleChange}
                        value={values.password}
                        error={!!touched.password && !!errors.password}
                        helperText={touched.password && errors.password}
                        inputProps={{ style: { textTransform: "capitalize" } }}
                    />
                    {/* <Button className='btn-login' type='submit' variant='contained' fullWidth size='large' endIcon={<LoginIcon />}>Login</Button> */}
                    <Button className='btn-login' type='submit' variant='contained' fullWidth size='large' >Login</Button>
                    <Box display='flex' justifyContent='center'>
                        <Button LinkComponent={Link} to='/Register' >Register</Button>
                    </Box>
                </form>
            )}
        </Formik>
    </Box>
  )
}

export default Login