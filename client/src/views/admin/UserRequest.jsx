import { Avatar, Box, Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BlockContent, handleRolesSelectData } from '../../components/global'
import axios from 'axios';
import { toast } from 'react-toastify';
import DynamicSelect from '../../components/DynamicSelect';
import { Global } from '../../context/GlobalContext';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const UserRequest = ({ data }) => {

    const { roles, updateList } = Global();
    const selectRoles = handleRolesSelectData(roles);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const initialValues = {
        role: user ? parseInt(user.role) : 0
    }

    const UserSchema = yup.object().shape({
        role: yup.number().required('This field is required!')
    });

    const handleAccountStatus = (status) => {
        user.status = status;
    }
    
    const handleSubmit = (values) => {
        
        setLoading(true);
        user.role = values.role;

        axios.post('/updateData', {
            collection: 'users',
            values: user
        }).then((res) => {
            if (res.data.status) {
                toast.success(res.data.message);
                data.status = 'Done';
                axios.post('/updateData', {
                    collection: 'notifications',
                    values: data
                }).then((res) => {
                    if (res.data.status) {
                        if (user.status === 'Approved') {
                            updateList(user.role === 3 ? 'students': 'teachers', user);
                        }
                        setTimeout(() => {
                            navigate('/Dashboard');
                        }, 2000);
                    }
                }).catch((err) => toast.error(err));

            }
        }).catch((err) => toast.error(err));
    }

    useEffect(() => {
        axios.post('/getData', {
            collection: 'users',
            filter: { _id: data.reference }
        }).then((res) => {
            if (res.data !== null) {
                setUser(res.data[0]);
            }
        }).catch((err) => toast.error(err));
    }, [data]);

    return (
        <Box flexGrow={1}>
            <Box>
                <Typography variant='h4'>User Informartion</Typography>
            </Box>
            {user !== null && (
                <Formik
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                    validationSchema={UserSchema}
                >
                    {({ values, errors, touched, handleChange, handleSubmit, setValues }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {Object.keys(user).map((label) => {
                                    const dataElement = [];
                                    switch (label) {
                                        case '_id':
                                        case 'password':
                                            break;
                                        case 'role':
                                            console.log(user[label]);
                                            if (user[label] !== 0) {
                                                dataElement.push(
                                                    <Grid item md={12}>
                                                        <BlockContent>
                                                            <Typography 
                                                                fontWeight='bold'
                                                            >
                                                                {label}:
                                                            </Typography>
                                                            <Typography>
                                                                { user[label] === '2' ?
                                                                    'Teacher' 
                                                                : user[label] === '3' ?
                                                                    'Student' 
                                                                    : '' 
                                                                }
                                                                </Typography>
                                                        </BlockContent>
                                                    </Grid>);
                                            }
                                            break;
                                        case 'fileDir':
                                            dataElement.push(
                                                <Grid item md={12}>
                                                    <BlockContent 
                                                        sx={{ 
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center' 
                                                        }}
                                                    >
                                                        <Typography>
                                                            <strong>Image Profile:</strong>
                                                        </Typography>
                                                        <Avatar 
                                                            alt='user' 
                                                            src={user[label]} 
                                                            sx={{ width: 76, height: 76 }} 
                                                        />
                                                    </BlockContent>
                                                </Grid>);
                                            break;
                                        default:
                                            dataElement.push(
                                                <Grid item md={6}>
                                                    <BlockContent>
                                                        <Typography fontWeight='bold'>{label}:</Typography>
                                                        <Typography>{user[label]}</Typography>
                                                    </BlockContent>
                                                </Grid>);
                                            break;
                                    }

                                    return dataElement;
                                })}
                                { user.role === 0 && (
                                    <Grid item md={12}>
                                        <BlockContent>
                                            <DynamicSelect
                                                fullWidth
                                                options={selectRoles}
                                                multiple={false}
                                                disabled={loading}
                                                setValues={setValues}
                                                label='Role'
                                                variant='outlined'
                                                type='text'
                                                name='role'
                                                onChange={handleChange}
                                                value={values.role}
                                                error={!!touched.role && !!errors.role}
                                                helperText={touched.role && errors.role}
                                            />
                                        </BlockContent>
                                    </Grid>
                                ) }
                                <Grid item md={12}>
                                    <BlockContent 
                                        sx={{ 
                                            display: 'flex', 
                                            width: '100%', 
                                            justifyContent: 'space-around'
                                        }}
                                    >
                                        <Button 
                                            variant='contained'
                                            color='success'
                                            type='submit'
                                            disabled={loading || user.status !== 'Pending'}
                                            onClick={() => handleAccountStatus('Approved') }>
                                                Approve
                                            </Button>
                                        <Button 
                                            variant='contained'
                                            color='error'
                                            type='submit'
                                            disabled={loading || user.status !== 'Pending'}
                                            onClick={() => handleAccountStatus('Denied') }>
                                                Denied
                                            </Button>
                                    </BlockContent>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            )}
        </Box>
    )
}

export default UserRequest