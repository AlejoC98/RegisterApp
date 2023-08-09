import React from 'react';
import { Global } from '../../context/GlobalContext';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { Block, BlockContent, calculateStudentTuitions } from '../../components/global';

const SchoolingFees = () => {
    const { courses, userCourses } = Global();
    const coursesList = userCourses.map(c => courses.find(d => d._id === c.course_id));
    const grandTotal = calculateStudentTuitions(coursesList.map(c => c._id), courses);

  return (
    <Box flexGrow={1}>
        <Block>
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <BlockContent>
                        <Typography variant='h5' fontWeight='bold'>Schooling Fees</Typography>
                    </BlockContent>
                </Grid>
                <Grid item md={12}>
                    <BlockContent>
                        { coursesList.map((course, index) => (
                            <Box key={index}>
                                <Box display='flex' width='100%' justifyContent='space-between' padding={3}>
                                    <Box display='flex' width='100%' justifyContent='center'>
                                        <Typography>{ course['Course ID']}</Typography>
                                    </Box>
                                    <Box display='flex' width='100%' justifyContent='center'>
                                        <Typography>{ course['Course Title']}</Typography>
                                    </Box>
                                    {/* <Box display='flex' width='100%' justifyContent='center'>
                                        <Typography>{ course['Credit Hours']}</Typography>
                                    </Box> */}
                                    <Box display='flex' width='100%' justifyContent='center'>
                                        <Typography>{ course['Tuition Cost']}</Typography>
                                    </Box>
                                </Box>
                                { (index + 1) === coursesList.length ? (
                                    <Divider>
                                        <Typography variant='h5'>Total</Typography>
                                    </Divider>
                                ) : (
                                    <Divider />
                                ) }
                            </Box>
                        )) }
                        <Box>
                            <Typography variant='h6' align='right'>{ grandTotal  }</Typography>
                        </Box>
                    </BlockContent>
                </Grid>
            </Grid>
        </Block>
    </Box>
  )
}

export default SchoolingFees
