import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { BlockContent } from '../global'
import AutoComplete from '../AutoComplete'
import { Formik } from 'formik';
import * as yup from 'yup';
import { Global } from '../../context/GlobalContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AssignStudentForm = ({ course }) => {

    const { students, userCourses, updateList } = Global();

    const currentStudents = userCourses.filter(c => c.course_id === course._id).map(s => s.user_id);
    const availableStudents = students.filter(s => !currentStudents.includes(s._id));
    const [status, setStatus] = useState(false);

    const handleSubmit = (values, { resetForm }) => {
        axios.post('/createData', {
            collection: 'usercourses',
            values: { user_id: values.student, course_id: course._id, status: 'Accepted' }
        }).then((res) => {
            if (res.data.status) {
                resetForm();
                course['Available'] -= 1;
                setStatus(true);
                updateList('usercourses', { user_id: values.student, course_id: course._id, status: 'Accepted' });
            }
        }).catch((err) => {
            toast.warning(err.response.data.message);
        });
    }

    const initialValues = {
        student: ''
    }

    const studentSchema = yup.object().shape({
        student: yup.string().required('An Student need to be selected!')
    });

    return (
        <Box flexGrow={1} mt={4}>

            { status ? (
                <Typography variant='h5' fontWeight='bold' align='center'>User Added!</Typography>
            ) : (
                <Formik
                onSubmit={handleSubmit}
                initialValues={initialValues}
                validationSchema={studentSchema}
            >
                {({ values, errors, touched, handleChange, handleSubmit, setValues }) => (
                    <form onSubmit={handleSubmit} >
                        <Grid container spacing={2}>
                            <Grid item md={12}>
                                <BlockContent>
                                    <Box mb={3}>
                                        <Typography variant='h6'>Looking for a new Student?</Typography>
                                    </Box>
                                    <AutoComplete
                                        fullWidth
                                        id='student'
                                        name='student'
                                        label='Students'
                                        value={values.student}
                                        setValues={setValues}
                                        error={!!touched.student && !!errors.student}
                                        helperText={touched.student && errors.student}
                                        onChange={handleChange}
                                        options={
                                            availableStudents.reduce((accumulator, currentObject) => {
                                                accumulator.push({text: `${currentObject.firstname} ${currentObject.lastname}`, value: currentObject._id});

                                                return accumulator;
                                            }, [])
                                        }
                                    />
                                </BlockContent>
                            </Grid>
                            <Grid item md={12} sx={{ display: 'flex', justifyContent: 'center'}}>
                                <Button type='submit'>Assign</Button>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>  
            )}
        </Box>
    )
}

export default AssignStudentForm