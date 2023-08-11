import { Avatar, Box, Grid, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Block, BlockContent } from '../../components/global';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Global } from '../../context/GlobalContext';
import CollapseList from '../../components/CollapseList';

const TeachersDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { courses } = Global();
    const [data] = useState(location.state.data);
    const teacherCourses = courses.filter(c => c['Teacher ID'] === data._id);
    
    const handleBack = () => {
        navigate('/Teachers');
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
            <Grid item md={6}>
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
                                <Typography variant='h6' fontWeight='bold'>Email:</Typography>
                                <Typography>{ data.email }</Typography>
                            </BlockContent>
                        </Grid>
                        <Grid item md={12}>
                            <BlockContent>
                                <Typography variant='h6' fontWeight='bold'>Phone Number</Typography>
                                <Typography>{ data.phone }</Typography>
                            </BlockContent>
                        </Grid>
                    </Grid>
                </Block>
            </Grid>
            <Grid item md={3}>
            <Block>
                <Box m={2}>
                    <Typography variant='h4' fontWeight='bold'>{ data.role === 1 ? 'Admin' : data.role === 2 ? 'Teacher' : data.role === 3 ? 'Student' : '' }</Typography>
                </Box>
                <Box m={2}>
                    <Typography variant='h6' fontWeight='bold'>Joined On</Typography>
                    <Typography>{ new Date(data.created).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) }</Typography>
                </Box>
            </Block>
        </Grid>
            <Grid item md={12}>
                <Block>
                    {/* <Typography variant='h5' fontWeight='bold'>Teacher's Classess</Typography> */}
                    <CollapseList 
                        title="Teacher's Classess"
                        data={teacherCourses}
                        fields={['Course Title', 'Classroom Number']}
                        handleOpen={handleOpenCourses}
                    />
                </Block>
            </Grid>
        </Grid>
    </Box>
  )
}

export default TeachersDetails