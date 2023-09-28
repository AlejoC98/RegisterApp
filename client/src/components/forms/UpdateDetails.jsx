import { Avatar, Box, Button, FormControl, Grid, IconButton, InputLabel, TextField } from '@mui/material';
import React, { useRef, useState } from 'react'
import { BlockContent, StyledTextarea, handleRolesSelectData } from '../global';
import * as yup from 'yup';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import DynamicSelect from '../DynamicSelect';
import { Global } from '../../context/GlobalContext';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'animate.css';
import axios from 'axios';
import AutoComplete from '../AutoComplete';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

const UpdateDetails = ({ data, type, order, setEdit, setData }) => {

    const { roles, teachers } = Global();
    const fileInputRef = useRef();
    const [profile, setProfile] = useState(data.fileDir);
    const selectRoles = handleRolesSelectData(roles);
    const initialValues = order.reduce((acc, column) => ({ ...acc, [column.field]: data[column.field] === undefined ? '' : data[column.field] }), {});

    const detailSchema = yup.object().shape(
        order.reduce((schemaFields, column) => ({
            ...schemaFields,
            [column.field]: column.field === 'password' ? yup.string().min(6, 
                'Password must be at least 6 characters') : column.field === 'Capacity' || column.field === 'Available' ? yup.number() : yup.string()
        }), {})
    );

    const handleSubmit = (values, {resetForm}) => {
        
        const formData = new FormData();
        const insertData = {_id: data._id}
        formData.append('collection', 'courses');

        Object.keys(values).forEach(key => {
            if (values[key] !== '') {
              switch (key) {
                case 'file':
                  formData.append(key, values[key]);
                  break;
                case 'dob':
                  insertData[key] = typeof values.dob === 'string' ? values.dob : values.dob.$d.toLocaleDateString('en-US', { dateStyle: 'short' });
                  break;
                default:
                  insertData[key] = values[key];
                  break;
              }
            }
        });

        formData.append('values', JSON.stringify(insertData));

        axios.post('/updateData', formData).then((res) => {
            if (res.data.status) {
                var newData = {...data, ...values};
                toast.success(res.data.message);
                setData(newData);
                setEdit(false);
            }
        }).catch((err) => {
            toast.warning(err.response.data.message);
        });
    }

    const handleOpenFile = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = async (newFile, setValues) => {
        const imageFile = newFile.target.files[0];
        setProfile(URL.createObjectURL(imageFile));

        setValues((prevValues) => ({
            ...prevValues,
            profile: imageFile,
        }));
    }

    return (
        <Box flexGrow={1} m={5}>
            {data !== null && (
                    <Formik
                        onSubmit={handleSubmit}
                        initialValues={initialValues}
                        validationSchema={detailSchema}
                    >
                        {({ values, errors, touched, handleChange, handleSubmit, handleBlur, setValues }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2} p='0 50px'>
                                    {order.map((column, index) => {
                                        let response;
                                        switch (column.field) {
                                            case 'Teacher ID':
                                                response = <Grid key={index} item md={12}>
                                                    <BlockContent>
                                                        <AutoComplete
                                                            fullWidth
                                                            id='teacher'
                                                            name='Teacher ID'
                                                            label='Teacher'
                                                            value={values.student}
                                                            setValues={setValues}
                                                            error={!!touched.student && !!errors.student}
                                                            helperText={touched.student && errors.student}
                                                            onChange={handleChange}
                                                            options={
                                                                teachers.reduce((accumulator, currentObject) => {
                                                                    accumulator.push({text: `${currentObject.firstname} ${currentObject.lastname}`, value: currentObject._id});

                                                                    return accumulator;
                                                                }, [])
                                                            }
                                                        />
                                                    </BlockContent>
                                                </Grid>;
                                                break;
                                            case 'fileDir':
                                                response = <Grid key={index} item md={column.size}>
                                                    <BlockContent>
                                                        <IconButton onClick={handleOpenFile}>
                                                            <Avatar src={profile} alt='profile' sx={{ width: 150, height: 150 }} />
                                                        </IconButton>
                                                        <input hidden type='file' ref={fileInputRef} onChange={(e) => handleFileChange(e, setValues)} />
                                                    </BlockContent>
                                                </Grid>;
                                                break;
                                            case 'password':
                                                response = <Grid key={index} item md={column.size}>
                                                    <BlockContent>
                                                        <TextField
                                                            fullWidth
                                                            name={column.field}
                                                            label={column.label}
                                                        />
                                                    </BlockContent>
                                                </Grid>;
                                                break;
                                            case 'role':
                                                response = <Grid key={index} item md={column.size}>
                                                    <BlockContent>
                                                        <DynamicSelect
                                                            fullWidth
                                                            options={selectRoles}
                                                            multiple={false}
                                                            setValues={setValues}
                                                            label={column.label}
                                                            variant='outlined'
                                                            type='text'
                                                            name={column.field}
                                                            onChange={handleChange}
                                                            value={values.role}
                                                            error={!!touched.role && !!errors.role}
                                                            helperText={touched.role && errors.role}
                                                        />
                                                    </BlockContent>
                                                </Grid>;
                                                break;
                                            case 'dob':
                                                response = <Grid item md={4}>
                                                    <BlockContent>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker']}>
                                                            <DatePicker
                                                                label="Date Of Birth"
                                                                name='dob'
                                                                defaultValue={dayjs(data.dob)}
                                                                onChange={(newDate) => setValues((prevValues) => ({
                                                                    ...prevValues,
                                                                    dob: newDate,
                                                                }))}
                                                                slotProps={{
                                                                    textField: {
                                                                        fullWidth: true,
                                                                        variant: 'outlined',
                                                                        error: !!touched.dob && !!errors.dob,
                                                                        helperText: touched.dob && errors.dob
                                                                    }
                                                                }}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </BlockContent>
                                                </Grid>
                                                break;
                                            case 'status':
                                                response = <Grid item md={6}>
                                                    <BlockContent>
                                                        <DynamicSelect
                                                            fullWidth
                                                            options={{'Approve': 'Approved', 'Denie': 'Denied'}}
                                                            multiple={false}
                                                            setValues={setValues}
                                                            label={column.label}
                                                            variant='outlined'
                                                            type='text'
                                                            name={column.field}
                                                            onChange={handleChange}
                                                            value={values.status}
                                                            error={!!touched.status && !!errors.status}
                                                            helperText={touched.status && errors.status}
                                                        />
                                                    </BlockContent>
                                                </Grid>
                                                break;
                                            case '':
                                                response = <Grid item md={12} key={index}>
                                                    <BlockContent>
                                                        <FormControl fullWidth>
                                                            <InputLabel htmlFor="my-textarea">{column.label}</InputLabel>
                                                            <StyledTextarea
                                                                aria-label="minimum height"
                                                                minRows={3}
                                                            />
                                                        </FormControl>
                                                    </BlockContent>
                                                </Grid>;
                                                break;
                                            case 'Capacity':
                                            case 'Available':
                                                response = <Grid key={index} item md={column.size}>
                                                    <BlockContent>
                                                        <TextField
                                                            fullWidth
                                                            variant='outlined'
                                                            type='number'
                                                            label={column.label}
                                                            value={values[column.field]}
                                                            name={column.field}
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            error={!!touched[column.field] && !!errors[column.field]}
                                                            helperText={touched[column.field] && errors[column.field]}
                                                            inputProps={{ style: { textTransform: "capitalize" } }}
                                                        />
                                                    </BlockContent>
                                                </Grid>;
                                                break;
                                            default:
                                                response = <Grid key={index} item md={column.size}>
                                                    <BlockContent>
                                                        <TextField
                                                            fullWidth
                                                            variant='outlined'
                                                            type='text'
                                                            label={column.label}
                                                            value={values[column.field]}
                                                            name={column.field}
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            error={!!touched[column.field] && !!errors[column.field]}
                                                            helperText={touched[column.field] && errors[column.field]}
                                                            inputProps={{ style: { textTransform: "capitalize" } }}
                                                        />
                                                    </BlockContent>
                                                </Grid>;
                                                break;
                                        }
                                        return response;
                                    })}
                                    <Grid item md={12}>
                                        <BlockContent>
                                            <Button startIcon={<SaveRoundedIcon />} type='submit' variant='contained' color='secondary'>Update</Button>
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

export default UpdateDetails