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
    const [requestedUser, setRequestedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const initialValues = {
        role: requestedUser && requestedUser.role !== null ? parseInt(requestedUser.role) : 3
    }

    const UserSchema = yup.object().shape({
        role: yup.number().required('This field is required!')
    });

    const handleAccountStatus = (status) => {
        requestedUser.status = status;
    }
    
    const handleSubmit = (values) => {
        
        setLoading(true);
        requestedUser.role = values.role;

        axios.post('/updateData', {
            collection: 'users',
            values: requestedUser
        }).then((res) => {
            if (res.data.status) {
                toast.success(res.data.message);
                updateList(requestedUser.role === 3 ? 'students': 'teachers', requestedUser);
                setTimeout(() => {
                    navigate('/Dashboard');
                }, 2000);
            }
        }).catch((err) => toast.error(err));
    }

    useEffect(() => {
        axios.post('/getData', {
            collection: 'users',
            filter: { _id: data.reference }
        }).then((res) => {
            if (res.data !== null) {
                setRequestedUser(res.data[0]);
            }
        }).catch((err) => toast.error(err));
    }, [data]);

    return (
        <Box flexGrow={1}>
            <Box>
                <Typography variant='h4'>User Informartion</Typography>
            </Box>
            {requestedUser !== null && (
                <Formik
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                    validationSchema={UserSchema}
                >
                    {({ values, errors, touched, handleChange, handleSubmit, setValues }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {Object.keys(requestedUser).map((label, index) => {
                                    const dataElement = [];
                                    switch (label) {
                                        case '_id':
                                        case 'password':
                                            break;
                                        case 'role':
                                            if (requestedUser[label] !== 0 && requestedUser[label] !== null) {
                                                dataElement.push(
                                                    <Grid key={index} item md={12}>
                                                        <BlockContent>
                                                            <Typography 
                                                                fontWeight='bold'
                                                            >
                                                                {label}:
                                                            </Typography>
                                                            <Typography>
                                                                { requestedUser[label] === 2 ?
                                                                    'Teacher' 
                                                                : requestedUser[label] === 3 ?
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
                                                <Grid key={index} item md={12}>
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
                                                            src={requestedUser[label]} 
                                                            sx={{ width: 76, height: 76 }} 
                                                        />
                                                    </BlockContent>
                                                </Grid>);
                                            break;
                                        case 'created':
                                            var request = new Date(requestedUser[label]);
                                            dataElement.push(
                                                <Grid key={index} item md={12}>
                                                    <BlockContent>
                                                        <Typography fontWeight='bold'>Request Sent:</Typography>
                                                        <Typography>
                                                            { request.toLocaleDateString('en-US', { 
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric' 
                                                                })
                                                            }
                                                        </Typography>
                                                    </BlockContent>
                                                </Grid>
                                            );
                                            break;
                                        default:
                                            dataElement.push(
                                                <Grid key={index} item md={6}>
                                                    <BlockContent>
                                                        <Typography fontWeight='bold'>{label}:</Typography>
                                                        <Typography>{requestedUser[label]}</Typography>
                                                    </BlockContent>
                                                </Grid>);
                                            break;
                                    }

                                    return dataElement;
                                })}
                                { (requestedUser.role === 0 || requestedUser.role === null) && (
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
                                            disabled={loading || requestedUser.status !== 'Pending'}
                                            onClick={() => handleAccountStatus('Approved') }>
                                                Approve
                                            </Button>
                                        <Button 
                                            variant='contained'
                                            color='error'
                                            type='submit'
                                            disabled={loading || requestedUser.status !== 'Pending'}
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