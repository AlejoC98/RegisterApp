import { Avatar, Box, Button, Grid, IconButton, TextField } from '@mui/material'
import { Formik } from 'formik'
import React, { useRef, useState } from 'react'
import * as yup from "yup";
import { BlockContent } from '../global';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserAuth } from '../../context/UserContext';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const UpdateProfileForm = ({ setSelected }) => {

  const { user, setUserData } = UserAuth();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);

  const initialValues = {
    firstname: '',
    lastname: '',
    username: '',
    dob: ''
  }

  const profileSchema = yup.object().shape({
    firstname: yup.string(),
    lastname: yup.string(),
    username: yup.string().min(6, 'Username must be at least 6 characters!'),
    dob: yup.string()
  });

  const handleSubmit = (values) => {

    const formData = new FormData();
    const insertData = {_id: user._id}
    formData.append('collection', 'profile');

    Object.keys(values).forEach(key => {
      if (values[key] !== '') {
        switch (key) {
          case 'file':
            formData.append(key, values[key]);
            break;
          case 'dob':
            insertData[key] = values.dob.$d.toLocaleDateString('en-US', { dateStyle: 'short' });
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
        insertData['fileDir'] = profile;
        toast.success(res.data.message);
        let newUserData = {...user,...insertData};
        setUserData(newUserData);
        setSelected('My Profile');
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
        file: imageFile,
    }));
}

  return (
    <Box flexGrow={1}>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={profileSchema}
      >
        {({ values, errors, touched, handleSubmit, handleChange, setValues }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item md={5}>
                <BlockContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <IconButton onClick={handleOpenFile}>
                    <Avatar sx={{ width: 150, height: 150}} src={profile} alt='profile'/>
                  </IconButton>
                  <input hidden type='file' name='file' ref={fileInputRef} onChange={(e) => handleFileChange(e, setValues)}/>
                </BlockContent>
              </Grid>
              <Grid item md={7}>
                <BlockContent sx={{ '& > *': { mb: 3}}}>
                  <TextField
                    fullWidth
                    variant='outlined'
                    type='text'
                    label='Firstname'
                    value={values.firstname}
                    name='firstname'
                    onChange={handleChange}
                    error={!!touched.firstname && !!errors.firstname}
                    helperText={touched.firstname && errors.firstname}
                    inputProps={{ style: { textTransform: "capitalize" } }}
                  />
                  <TextField
                    fullWidth
                    variant='outlined'
                    type='text'
                    label='Lastname'
                    value={values.lastname}
                    name='firstname'
                    onChange={handleChange}
                    error={!!touched.lastname && !!errors.lastname}
                    helperText={touched.lastname && errors.lastname}
                    inputProps={{ style: { textTransform: "capitalize" } }}
                  />
                  <TextField
                    fullWidth
                    variant='outlined'
                    type='text'
                    label='Username'
                    value={values.username}
                    name='username'
                    onChange={handleChange}
                    error={!!touched.username && !!errors.username}
                    helperText={touched.username && errors.username}
                    inputProps={{ style: { textTransform: "capitalize" } }}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker
                            label="Date Of Birth"
                            name='dob'
                            defaultValue={dayjs(user.dob)}
                            onChange={(newDate) => setValues((prevValues) => ({
                                ...prevValues,
                                dob: newDate,
                            }))}
                            slotProps={{
                                textField: {
                                    variant: 'outlined',
                                    error: !!touched.dob && !!errors.dob,
                                    helperText: touched.dob && errors.dob
                                }
                            }}
                        />
                    </DemoContainer>
                  </LocalizationProvider>
                  <Button disabled={values.firstname === '' && values.lastname === '' && values.username === '' && values.dob === '' && profile === null} variant='contained' color='secondary' type='submit'>Update</Button>
                </BlockContent>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Box>
  )
}

export default UpdateProfileForm