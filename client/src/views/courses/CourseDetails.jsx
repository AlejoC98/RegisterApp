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
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import UpdateDetails from '../../components/forms/UpdateDetails';
import AssignStudentForm from '../../components/forms/AssignStudentForm';

const CourseDetails = () => {
    const { user } = UserAuth();
    const { teachers, students, userCourses, setCourses, courses, setUserCourses } = Global();
    const location = useLocation();
    const navigate = useNavigate();

    const [edit, setEdit] = useState(null);
    const [joinedStatus, setJoinedStatus] = useState();
    const [data, setData] = useState(location.state.data);
    const [courseStudents, setCourseStudents] = useState([]);
    const courseTeacher = teachers.find(t => t._id === data['Teacher ID']);

    useEffect(() => {
        setCourseStudents([]);

        if (userCourses.length > 0 && user.role !== 1) {
            let cStatus = userCourses.find(c => c.course_id === data._id);
            setJoinedStatus(cStatus ? cStatus.status : 'available');
        } else {
            setJoinedStatus('available');
        }

        const courses = userCourses.filter(c => c.course_id === data._id);

        if (courses.length > 0) {
            courses.forEach((ele) => {
                setCourseStudents((prev) => [...prev, students.find(s => s._id === ele.user_id)]);
            });
        }

    }, [user, userCourses, data, students, setCourseStudents]);

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
            }
        }).catch((err) => toast.error(err));
    }

    const handleDelete = () => {
        axios.post('/deleteData', {
            collection: 'courses',
            filter: { _id: data._id }
        }).then((res) => {
            if (res.data.status) {
                toast.info(res.data.message);
                setCourses(courses.filter(c => c._id !== data._id));
                handleBack();
            }
        }).catch((err) => {
            toast.warning(err.response.data.message);
        });
    }

    const handleRemoveStudent = (student) => {
        const record = userCourses.find(c => c.user_id === student._id && c.course_id === data._id);
        
        if (record !== undefined) {
            axios.post('/deleteData', {
                collection: 'usercourses',
                filter: { _id: record._id }
            }).then((res) => {
                if (res.data.status) {
                    data['Available'] += 1;
                    toast.warning('Student removed from course.');
                    setCourseStudents(courseStudents.filter(s => s._id !== student._id));
                    setUserCourses(userCourses.filter(c => c._id !== record._id));
                }
            }).catch((err) => {
                toast.warning(err);
            });
        }
    }

    return (
        <Box flexGrow={1}>
            {data && (
                <Grid container spacing={2}>
                    <Grid item md={12}>
                        <BlockContent sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                            <IconButton onClick={() => edit ? setEdit(false) : handleBack()}>
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
                                <Box position='absolute' right={0} display='flex' overflow='hidden' justifyContent='end'>
                                    <Box
                                        className={`animate__animated ${edit ? 'animate__lightSpeedInRight' : edit === false && 'animate__lightSpeedOutRight'}`}
                                        sx={{ display: edit ? 'flex' : 'none', '& > *': { marginRight: 1 } }}
                                    >
                                        <DialogModal
                                            title='Delete Teacher'
                                            buttonText='Delete'
                                            buttonColor='error'
                                            buttonType={2}
                                            buttonIcon='DeleteRounded'
                                            content={
                                                <Box
                                                    display='flex'
                                                    justifyContent='center'
                                                    alignItems='center'
                                                    p={3}
                                                >
                                                    <Typography variant='h6'>
                                                        Are you sure you want to delete this course?
                                                    </Typography>
                                                </Box>
                                            } 
                                            actionButtons={
                                                { 
                                                    disagree: { text: 'Cancel' }, 
                                                    agree: { text: 'Confirm', func: handleDelete } 
                                                }
                                            } 
                                        />
                                        <IconButton onClick={() => setEdit(false)}>
                                            <CloseRoundedIcon />
                                        </IconButton>
                                    </Box>
                                    <Box display={edit ? 'none' : 'flex'} className={`animate__animated ${edit ? 'animate__lightSpeedOutRight' : 'animate__lightSpeedInRight'}`}>
                                        <Box display={courseTeacher !== undefined ? 'none' : 'block'} mr={2}>
                                            <DialogModal title='Assign Teacher' buttonText='Assing Teacher' buttonColor='info' content={<AssingTeacherForm course={data} />} />
                                        </Box>
                                        <Box mr={2}>
                                            <Button variant='contained' color='secondary' onClick={() => setEdit(true)}>Edit</Button>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                        </BlockContent>
                    </Grid>
                    {edit ? (
                        <>
                            <Grid item md={12}>
                                <Block>
                                    <Typography variant='h4' fontWeight='bold'>Edit Student</Typography>
                                    <UpdateDetails
                                        data={data}
                                        setData={setData}
                                        setEdit={setEdit}
                                        type={'Courses'}
                                        order={
                                            [
                                                { field: 'Course ID', label: 'Course ID', size: 6 },
                                                { field: 'Course Title', label: 'Course Title', size: 6 },
                                                { field: 'Course Description', label: 'Course Description', size: 12 },
                                                { field: 'Classroom Number', label: 'Classroom Number', size: 6 },
                                                { field: 'Capacity', label: 'Capacity', size: 6 },
                                                { field: 'Credit Hours', label: 'Credit Hours', size: 6 },
                                                { field: 'Tuition Cost', label: 'Tuition Cost', size: 6 },
                                                { field: 'Available', label: 'Available', size: 6 },
                                                { field: 'Teacher ID', label: 'Teacher ID', size: 6 },
                                            ]
                                        }
                                    />
                                </Block>
                            </Grid>
                            <Grid item md={12}>
                                <Block>
                                    <CollapseList
                                        title='Current Students'
                                        data={courseStudents}
                                        fields={['fullname', 'username']}
                                        handleOpen={() => {}}
                                        mode='edit'
                                        editActions={
                                            {
                                                addBtn: 
                                                <DialogModal
                                                    title='New Student'
                                                    buttonText=''
                                                    buttonColor='secondary'
                                                    buttonType={3}
                                                    buttonIcon='AddRounded'
                                                    content={
                                                        <AssignStudentForm course={data} />
                                                    }
                                                />,
                                                removeBtn: {
                                                    title: 'Remove Student',
                                                    text: 'Are you sure you want to remove this student from this course?',
                                                    func:  handleRemoveStudent
                                                }
                                            }
                                        }
                                    />
                                </Block>
                            </Grid>
                        </>
                    ) : (
                        <>
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
                                        {courseTeacher !== undefined && (
                                            <Grid item md={3}>
                                                <Typography fontWeight='bold' variant='h5' sx={{ mb: 1 }}>Teacher:</Typography>
                                                <Box display='flex' flexDirection='column' alignItems='center'>
                                                    <Avatar src={courseTeacher.fileDir} alt='profile' />
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
                            {courseStudents.length > 0 && (
                                <Grid item md={12}>
                                    <Block>
                                        <CollapseList
                                            title='Current Students'
                                            data={courseStudents}
                                            fields={['fullname', 'username']}
                                            handleOpen={() => { }}
                                        />
                                    </Block>
                                </Grid>
                            )}
                        </>
                    )}
                </Grid>
            )}
        </Box>
    )
}

export default CourseDetails