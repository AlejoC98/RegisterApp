import { Box, IconButton, Typography } from '@mui/material';
import React, {} from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/forms/RegisterForm';

const Register = () => {
    return (
        <Box className='auth-box reg'>
            <Box display='flex' justifyContent='center' alignItems='center' width='100%' position='relative'>
                <IconButton sx={{ position: 'absolute', left: 0}} LinkComponent={Link} to='/'>
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant='h2' sx={{ textAlign: 'center', margin: '15px 0' }} className='auth-title' >Register</Typography>
            </Box>
            <RegisterForm />
        </Box>
    )
}

export default Register