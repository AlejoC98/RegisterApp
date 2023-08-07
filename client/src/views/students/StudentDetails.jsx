import React, { useEffect, useState } from 'react';
import { Avatar, Box, Grid, IconButton, Typography } from '@mui/material';
import { Block, BlockContent } from '../../components/global';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { Global } from '../../context/GlobalContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import CollapseList from '../../components/CollapseList';

const StudentDetails = () => {
    
    const location = useLocation();
    const [data, setData] = useState(location.state.data);
    const navigate = useNavigate();
    const { courses } = Global();
    const [displayStudentCourses, setDisplayStudentCourses] = useState([]);

    useEffect(() => {
        setData(location.state.data);
        axios.post('/getData', {
            collection: 'usercourses',
            filter: {user_id: data._id}
        }).then((res) => {
            if (res.data) {
                res.data.forEach((course) => {
                    setDisplayStudentCourses((prev) => [...prev, courses.find(c => c['_id'] === course.course_id)]);
                });
            }
        }).catch((err) => toast.warning(err));
    }, [location, data, courses]);

    const handleBack = () => {
        navigate('/Students');
    }

    const handleOpenCourses = (course) => {
        navigate(`/Courses/${course._id}`, {state: {data: course}});
    }

  return (
    <Box flexGrow={1}>
    <Grid container spacing={2}>
        <Grid item md={12}>
            <BlockContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton onClick={handleBack}>
                    <ArrowBackIosNewRoundedIcon />
                </IconButton>
            </BlockContent>
        </Grid>
        <Grid item md={3}>
            <Block sx={{ display: 'flex', justifyContent: 'center'}}>
                <Avatar src={data.fileDir} alt='profile' sx={{ width: 160, height: 160}}/>
            </Block>
        </Grid>
        <Grid item md={9}>
            <Block>
                <Grid container spacing={2}>
                    <Grid item md={4}>
                        <BlockContent>
                            <Typography variant='h6' fontWeight='bold'>Firsname:</Typography>
                            <Typography>{ data.firstname }</Typography>
                        </BlockContent>
                    </Grid>
                    <Grid item md={4}>
                        <BlockContent>
                            <Typography variant='h6' fontWeight='bold'>Lastname:</Typography>
                            <Typography>{ data.lastname }</Typography>
                        </BlockContent>
                    </Grid>
                    <Grid item md={4}>
                        <BlockContent>
                            <Typography variant='h6' fontWeight='bold'>Username:</Typography>
                            <Typography>{ data.username }</Typography>
                        </BlockContent>
                    </Grid>
                    <Grid item md={6}>
                        <BlockContent>
                            <Typography variant='h6' fontWeight='bold'>Email:</Typography>
                            <Typography>{ data.email }</Typography>
                        </BlockContent>
                    </Grid>
                    <Grid item md={6}>
                        <BlockContent>
                            <Typography variant='h6' fontWeight='bold'>Phone Number</Typography>
                            <Typography>{ data.phone }</Typography>
                        </BlockContent>
                    </Grid>
                </Grid>
            </Block>
        </Grid>
        { displayStudentCourses.length > 0 && (
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
    </Grid>
</Box>
  )
}

export default StudentDetails