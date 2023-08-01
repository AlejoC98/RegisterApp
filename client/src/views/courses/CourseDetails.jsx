import { Avatar, Box, Button, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Block, BlockContent } from '../../components/global';
import { UserAuth } from '../../context/UserContext';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import DialogModal from '../../components/DialogModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import AssingTeacherForm from '../../components/forms/AssingTeacherForm';
import { Global } from '../../context/GlobalContext';
import CollapseList from '../../components/CollapseList';

const CourseDetails = () => {
    const { user, userCourses, setUserCoursesData } = UserAuth();
    const { teachers, students } = Global();
    const location = useLocation();
    const navigate = useNavigate();
    const [data] = useState(location.state.data);
    const [joinedStatus, setJoinedStatus] = useState();
    const courseTeacher = teachers.find(t => t._id === data['Teacher ID']);
    const [courseStudents, setCourseStudents] = useState([]);

    useEffect(() => {
        if (userCourses.length > 0) {
            let cStatus = userCourses.find(c => c.course_id === data._id);
            setJoinedStatus(cStatus ? cStatus.status : 'available');
        } else {
            setJoinedStatus('available');
        }

        axios.post('/getData', {
            collection: 'usercourses',
            filter: {course_id: data._id, status: 'Accepted'}
        }).then((res) => {
            if (res.data) {
                res.data.forEach((ele) => {
                    setCourseStudents((prev) => [...prev, students.find(s => s._id === ele.user_id)]);
                });
            }
            console.log(res.data);
        }).catch((err) => toast.warning(err));
    }, [userCourses, data, students, setCourseStudents]);

    const handleBack = () => {
        navigate('/Courses');
    }

    const handleJoin = () => {
        axios.post('/createData', {
            collection: 'usercourses',
            values: { user_id: user._id, course_id: data._id }
        }).then((res) => {
            if (res.data) {
                toast.info('Your request has been sent!');
                setJoinedStatus('Pending');
            }
        }).catch((err) => toast.error(err));
    }

    const handleLeave = () => {
        axios.post('/deleteData', {
            collection: 'usercourses',
            filter: { course_id: data._id }
        }).then((res) => {
            if (res.data) {
                toast.warning('Course Left');
                setJoinedStatus('joined');
                setUserCoursesData(userCourses.filter(c => c.course_id !== data._id));
            }
        }).catch((err) => toast.error(err));
    }

    return (
        <Box flexGrow={1}>
            { data && (
                <Grid container spacing={2}>
                <Grid item md={12}>
                    <BlockContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <IconButton onClick={handleBack}>
                            <ArrowBackIosNewRoundedIcon />
                        </IconButton>
                        {user.role === 3 ? (
                            <Box>
                                {joinedStatus === 'available' ? (
                                    <DialogModal title='Join Course' buttonText='Join' buttonColor='secondary' content={<Box display='flex' justifyContent='center' alignItems='center' p={3}>
                                        <Typography variant='h6'>Do you want to join this course?</Typography>
                                    </Box>} actionButtons={{ disagree: { text: 'Cancel' }, agree: { text: 'Join', func: handleJoin } }} />
                                ) : joinedStatus === 'Accepted' ? (
                                    <Button variant='contained' color='error' onClick={handleLeave}>Leave</Button>
                                ) : joinedStatus === 'Denied' ? (
                                    <Typography variant='h6'>Unfortunately your request was denied!</Typography>
                                ) : (
                                    <Button variant='contained' disabled onClick={handleLeave}>Pending</Button>
                                )}
                            </Box>
                        ) : user.role === 1 && (
                            <Box display={courseTeacher !== undefined ? 'none' : 'block'}>
                                <DialogModal title='Assign Teacher' buttonText='Assing Teacher' buttonColor='info' content={<AssingTeacherForm course={data} />} />
                            </Box>
                        )}
                    </BlockContent>
                </Grid>
                <Grid item md={12}>
                    <Block>
                        <Grid container spacing={2}>
                            <Grid item md={courseTeacher === undefined ? 4 : 3}>
                                <Typography fontWeight='bold' variant='h5' sx={{ mb: 1 }}>ID:</Typography>
                                <Typography>{data['Course ID']}</Typography>
                            </Grid>
                            <Grid item md={courseTeacher === undefined ? 4 : 3}>
                                <Typography fontWeight='bold' variant='h5' sx={{ mb: 1 }}>ClassRoom Number:</Typography>
                                <Typography>{data['Classroom Number']}</Typography>
                            </Grid>
                            <Grid item md={courseTeacher === undefined ? 4 : 3}>
                                <Typography fontWeight='bold' variant='h5' sx={{ mb: 1 }}>Title:</Typography>
                                <Typography>{data['Course Title']}</Typography>
                            </Grid>
                            { courseTeacher !== undefined && (
                                <Grid item md={3}>
                                    <Typography fontWeight='bold' variant='h5' sx={{ mb: 1 }}>Teacher:</Typography>
                                    <Box display='flex' flexDirection='column' alignItems='center'>
                                        <Avatar src={courseTeacher.fileDir} alt='profile'/>
                                        <Typography>{courseTeacher.firstname} {courseTeacher.lastname}</Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Block>
                </Grid>
                <Grid item md={data['Course Description'].length > 400 ? 12 : 6}>
                    <Block>
                        <Typography fontWeight='bold' variant='h5' sx={{ mb: 1 }}>Description:</Typography>
                        <Typography>
                            {data['Course Description']}
                        </Typography>
                    </Block>
                </Grid>
                <Grid item md={data['Course Description'].length > 400 ? 12 : 6}>
                    <Block>
                        <Grid container spacing={2}>
                            <Grid item md={3}>
                                <Typography fontWeight='bold' variant='h5' sx={{ mb: 1 }}>Capacity:</Typography>
                                <Typography>{data['Capacity']}</Typography>
                            </Grid>
                            <Grid item md={3}>
                                <Typography fontWeight='bold' variant='h5' sx={{ mb: 1 }}>Available Spaces:</Typography>
                                <Typography>{data['Available']}</Typography>
                            </Grid>
                            <Grid item md={3}>
                                <Typography fontWeight='bold' variant='h5' sx={{ mb: 1 }}>Credit Hours:</Typography>
                                <Typography>{data['Credit Hours']}</Typography>
                            </Grid>
                            <Grid item md={3}>
                                <Typography fontWeight='bold' variant='h5' sx={{ mb: 1 }}>Tuition Cost:</Typography>
                                <Typography>{data['Tuition Cost']}</Typography>
                            </Grid>
                        </Grid>
                    </Block>
                </Grid>
                { courseStudents.length > 0 && (
                    <Grid item md={12}>
                        <Block>
                            <CollapseList 
                                title='Current Students'
                                data={courseStudents}
                                fields={['fullname', 'username']}
                                handleOpen={() => {}}
                            />
                        </Block>
                    </Grid>
                )}
            </Grid>
            )}
        </Box>
    )
}

export default CourseDetails