import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { BlockContent } from '../../components/global';
import { useNavigate } from 'react-router-dom';

const JoinCourseRequest = ({ data }) => {

    const navigate = useNavigate();
    const [userCourseData, setUserCourseData] = useState();
    const [studentData, setStudentData] = useState(undefined);
    const [courseData, setCourseData] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const handleJoinRequest = (status) => {

        if (status === 'Accepted') {
            if (courseData['Available'] === 0) {
                toast.warning('There\'s not more available space in this course!');
                return false;
            }
        }

        setLoading(true);

        axios.post('/updateData', {
            collection: 'usercourses',
            values: { _id: userCourseData._id, user_id: studentData._id, course_id: courseData._id, status: status, course_space: courseData['Available'] - 1}
        }).then((res) => {
            if (res.data.status) {
                toast.success(res.data.message);
                setTimeout(() => {
                    navigate('/Dashboard');
                }, 1000);
            }
        }).catch((err) => toast.error(err));
    }

    const getStudent = useCallback((userID) => {
        axios.post('/getData', {
            collection: 'users',
            filter: {_id: userID}
        }).then((res) => {
            if (res.data) {
                setStudentData(res.data[0]);
            }
        }).catch((err) => toast.error(err));
    }, [setStudentData]);

    const getCourse = useCallback((courseID) => {
        axios.post('/getData', {
            collection: 'courses',
            filter: {_id: courseID}
        }).then((res) => {
            if (res.data) {
                setCourseData(res.data[0]);
            }
        }).catch((err) => toast.error(err));
    }, [setCourseData]);

    const getUserCourse = useCallback(() => {
        axios.post('/getData', {
            collection: 'usercourses',
            filter: { _id: data.reference}
        }).then((res) => {
            if (res.data) {
                setUserCourseData(res.data[0]);
                getStudent(res.data[0].user_id);
                getCourse(res.data[0].course_id);
            }
        }).catch((err) => toast.error(err));
    }, [getStudent, getCourse, data]);

    useEffect(() => {
        getUserCourse();
    }, [getUserCourse]);

  return (
    <Box flexGrow={1}>
        <Box>
            <Typography variant='h5' fontWeight='bold'>{ data.title }</Typography>
            <Box position='relative' right={0}>
                { userCourseData !== undefined && (
                    <Typography 
                        variant='h6' 
                        sx={{ color: userCourseData.status === 'Accepted' ? '#198754' : userCourseData.status === 'Denied' ? '#DC3546' : ''}}>
                            { userCourseData.status }
                    </Typography>
                ) }
            </Box>
        </Box>
        { studentData !== undefined && courseData !== undefined && (
            <Grid container spacing={2} sx={{ mb: 3}}>
                <Grid item md={12}>
                    <BlockContent>
                        <Typography variant='h6' textAlign='start'>Student Information</Typography>
                    </BlockContent>
                </Grid>
                <Grid item md={3}>
                    <BlockContent>
                        <Typography fontWeight='bold '>Full Name:</Typography>
                        <Typography>{ studentData.firstname } { studentData.lastname }</Typography>
                    </BlockContent>
                </Grid>
                <Grid item md={3}>
                    <BlockContent>
                        <Typography fontWeight='bold'>Email:</Typography>
                        <Typography>{ studentData.email }</Typography>
                    </BlockContent>
                </Grid>
                <Grid item md={3}>
                    <BlockContent>
                        <Typography fontWeight='bold'>Phone Number:</Typography>
                        <Typography>{ studentData.phone }</Typography>
                    </BlockContent>
                </Grid>
                <Grid item md={3}>
                    <BlockContent>
                        <Typography fontWeight='bold'>Username:</Typography>
                        <Typography>{ studentData.username }</Typography>
                    </BlockContent>
                </Grid>
                <Grid item md={12}>
                    <BlockContent>
                        <Typography variant='h6' textAlign='start'>Course Information</Typography>
                    </BlockContent>
                </Grid>
                <Grid item md={3}>
                    <BlockContent>
                        <Typography fontWeight='bold'>Course Title:</Typography>
                        <Typography>{ courseData['Course Title'] }</Typography>
                    </BlockContent>
                </Grid>
                <Grid item md={3}>
                    <BlockContent>
                        <Typography fontWeight='bold'>Tuition Cost:</Typography>
                        <Typography>{ courseData['Tuition Cost'] }</Typography>
                    </BlockContent>
                </Grid>
                <Grid item md={3}>
                    <BlockContent>
                        <Typography fontWeight='bold'>Capacity:</Typography>
                        <Typography>{ courseData['Capacity'] }</Typography>
                    </BlockContent>
                </Grid>
                <Grid item md={3}>
                    <BlockContent>
                        <Typography fontWeight='bold'>Available Spaces:</Typography>
                        <Typography>{ courseData['Available'] }</Typography>
                    </BlockContent>
                </Grid>
            </Grid>
        )}
        { userCourseData !== undefined && (
            <Box display={userCourseData.status === 'Pending' ? 'block' : 'none'} >
                <Divider />
                <Box display='flex' justifyContent='space-evenly' pt={4} pb={2}>
                    <Button disabled={loading} variant='contained' color='error' onClick={() => handleJoinRequest('Denied')}>Denied</Button>
                    <Button disabled={loading} variant='contained' color='success' onClick={() => handleJoinRequest('Accepted')}>Accept</Button>
                </Box>
            </Box>
        ) }
    </Box>
  )
}

export default JoinCourseRequest