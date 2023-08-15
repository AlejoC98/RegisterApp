import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import DynamicSelect from '../DynamicSelect';
import { Global } from '../../context/GlobalContext';
import { Formik } from 'formik';
import * as yup from 'yup';
import { BlockContent, handleDynamicData } from '../global';
import { toast } from 'react-toastify';
import axios from 'axios';

const AssingTeacherForm = ({ course }) => {

    const { teachers } = Global();
    const teacherSelectData = handleDynamicData(teachers, 'fullname', '_id');
    const [status, setStatus] = useState(false);

    const initialValues = {
        teacher: ''
    }

    const handleSubmit = async(values) => {
        axios.post('/updateData', {
            collection: 'courses',
            values: {_id: course._id, 'Teacher ID' : values.teacher}
        }).then((res) => {
            if (res.data.status) {
                setStatus(res.data.status);
            }
        }).catch((err) => toast.warning(err));
    }

    const teacherSchema = yup.object().shape({
        teacher: yup.string().required('Teacher must be select!'),
    });

  return (
    <Box flexGrow={1} sx={{ pt: 3}}>
        { status ? (
            <Typography align='center'>Teacher has been assigned to this course.</Typography>
        ) : (
            <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={teacherSchema}
        >
            {({ values, errors, touched, handleChange, handleSubmit, setValues }) => (
                <form onSubmit={handleSubmit} >
                    <Grid container spacing={2}>
                        <Grid item md={12}>
                            <BlockContent>
                                <DynamicSelect 
                                    fullWidth
                                    options={teacherSelectData}
                                    multiple={false}
                                    disabled={false}
                                    setValues={setValues}
                                    label='Teacher'
                                    variant='outlined'
                                    type='text'
                                    name='teacher'
                                    onChange={handleChange}
                                    value={values.teacher}
                                    error={!!touched.teacher && !!errors.teacher}
                                    helperText={touched.teacher && errors.teacher}
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

export default AssingTeacherForm