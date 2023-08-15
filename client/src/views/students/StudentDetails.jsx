import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { Block, BlockContent } from '../../components/global';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { Global } from '../../context/GlobalContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import CollapseList from '../../components/CollapseList';
import { UserAuth } from '../../context/UserContext';
import UpdateDetails from '../../components/forms/UpdateDetails';
import DialogModal from '../../components/DialogModal';

const StudentDetails = () => {

    const { courses, getData } = Global();
    const { user } = UserAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(location.state.data);
    const [edit, setEdit] = useState(null);
    const [displayStudentCourses, setDisplayStudentCourses] = useState([]);

    useEffect(() => {
        // setData(location.state.data);
        axios.post('/getData', {
            collection: 'usercourses',
            filter: { user_id: data._id }
        }).then((res) => {
            if (res.data) {
                res.data.forEach((course) => {
                    setDisplayStudentCourses(
                        (prev) => [...prev, courses.find(c => c['_id'] === course.course_id)]
                    );
                });
            }
        }).catch((err) => toast.warning(err));
    }, [location, data, courses]);

    const handleBack = () => {
        navigate('/Students');
    }

    const handleOpenCourses = (course) => {
        navigate(`/Courses/${course._id}`, { state: { data: course } });
    }

    const handleDelete = () => {
        axios.post('/deleteData', {
            collection: 'students',
            filter: {_id: data._id}
        }).then((res) => {
            if (res.data.status) {
                getData();
                toast.info(res.data.message);
                handleBack();
            }
        }).catch((err) => {
            toast.warning(err.response.data.message);
        });
    }

    return (
        <Box flexGrow={1} className={`animate__animated ${ !edit && 'animate__zoomIn'}  animate__faster`}>
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <BlockContent sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        <IconButton onClick={handleBack}>
                            <ArrowBackIosNewRoundedIcon />
                        </IconButton>
                        { user.role === 1 && (
                            <Box position='absolute' right={0} display='flex' overflow='hidden' justifyContent='end'>
                                <Box 
                                    className={`animate__animated ${edit ? 'animate__lightSpeedInRight' : edit === false ? 'animate__lightSpeedOutRight' : 'hide'}`} 
                                    sx={{display: edit ? 'flex' : 'none', '& > *': { marginRight: 1 } }}
                                >
                                    <IconButton onClick={() => setEdit(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                    <DialogModal
                                        title='Delete Student'
                                        buttonText='Delete'
                                        buttonColor='error'
                                        content={
                                            <Box 
                                                display='flex'
                                                justifyContent='center'
                                                alignItems='center'
                                                p={3}
                                            >
                                            <Typography variant='h6'>Are you sure you want to delete this student?</Typography>
                                        </Box>} actionButtons={{ disagree: { text: 'Cancel' }, agree: { text: 'Confirm', func: handleDelete } }} />
                                </Box>
                                <Box display={ edit ? 'none' : 'flex'}>
                                    <Button className={`animate__animated ${edit ? 'animate__lightSpeedOutRight' : 'animate__lightSpeedInRight'}`} variant='contained' color='secondary' onClick={() => setEdit(true)}>Edit</Button>
                                </Box>
                            </Box>
                        )}
                    </BlockContent>
                </Grid>
                {edit ? (
                    <Grid item md={12}>
                        <Block className='animate__animated animate__zoomIn animate__faster'>
                            <Typography variant='h4' fontWeight='bold'>Edit Student</Typography>
                            <UpdateDetails
                                data={data}
                                setData={setData}
                                setEdit={setEdit}
                                type={'Students'}
                                order={
                                    [
                                        { field: 'fileDir', label: 'Profile', size: 12 },
                                        { field: 'firstname', label: 'First Name', size: 6 },
                                        { field: 'lastname', label: 'Lastname', size: 6 },
                                        { field: 'username', label: 'Username', size: 6 },
                                        { field: 'password', label: 'Password', size: 6 },
                                        { field: 'role', label: 'Role', size: 6 },
                                        { field: 'status', label: 'Status', size: 6 },
                                        { field: 'email', label: 'Email', size: 4 },
                                        { field: 'phone', label: 'Phone Number', size: 4 },
                                        { field: 'dob', label: 'Date Of Birth', size: 4 },
                                        { field: 'country', label: 'Country', size: 6 },
                                        { field: 'city', label: 'City', size: 6 },
                                        { field: 'address', label: 'Address', size: 12 },
                                        { field: 'state', label: 'State', size: 6 },
                                        { field: 'zipcode', label: 'Zipcode', size: 6 },
                                    ]
                                }
                            />
                        </Block>
                    </Grid>
                ) : (
                    <>
                        <Grid item md={3}>
                            <Block sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Avatar src={data.fileDir} alt='profile' sx={{ width: 160, height: 160 }} />
                            </Block>
                        </Grid>
                        <Grid item md={6}>
                            <Block>
                                <Grid container spacing={2}>
                                    <Grid item md={6}>
                                        <BlockContent>
                                            <Typography variant='h6' fontWeight='bold'>Firstname:</Typography>
                                            <Typography>{data.firstname}</Typography>
                                        </BlockContent>
                                    </Grid>
                                    <Grid item md={6}>
                                        <BlockContent>
                                            <Typography variant='h6' fontWeight='bold'>Lastname:</Typography>
                                            <Typography>{data.lastname}</Typography>
                                        </BlockContent>
                                    </Grid>
                                    <Grid item md={6}>
                                        <BlockContent>
                                            <Typography variant='h6' fontWeight='bold'>Username:</Typography>
                                            <Typography>{data.username}</Typography>
                                        </BlockContent>
                                    </Grid>
                                    <Grid item md={6}>
                                        <BlockContent>
                                            <Typography variant='h6' fontWeight='bold'>Email:</Typography>
                                            <Typography>{data.email}</Typography>
                                        </BlockContent>
                                    </Grid>
                                </Grid>
                            </Block>
                        </Grid>
                        <Grid item md={3}>
                            <Block>
                                <Box m={2}>
                                    <Typography variant='h4' fontWeight='bold'>{data.role === 1 ? 'Admin' : data.role === 2 ? 'Teacher' : data.role === 3 ? 'Student' : ''}</Typography>
                                </Box>
                                <Box m={2}>
                                    <Typography variant='h6' fontWeight='bold'>Joined On</Typography>
                                    <Typography>{new Date(data.created).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
                                </Box>
                            </Block>
                        </Grid>
                        {displayStudentCourses.length > 0 && (
                            <Grid item md={12}>
                                <Block>
                                    <CollapseList
                                        title='Student Joined Courses'
                                        data={displayStudentCourses}
                                        fields={['Course Title', 'Classroom Number']}
                                        handleOpen={handleOpenCourses}
                                    />
                                </Block>
                            </Grid>
                        )}
                    </>
                )}
            </Grid>
        </Box>
    )
}

export default StudentDetails