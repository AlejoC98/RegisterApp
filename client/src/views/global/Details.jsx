import React, { useEffect, useState } from 'react'
import { Global } from '../../context/GlobalContext';
import CollapseList from '../../components/CollapseList';
import { useLocation, useNavigate } from 'react-router-dom'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Avatar, Box, Button, Grid, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Block, BlockContent, capitalizeString, getUserCoursers } from '../../components/global';
import UpdateDetails from '../../components/forms/UpdateDetails';
import { toast } from 'react-toastify';
import axios from 'axios';

const Details = ({ columns, type, collapse }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { courses, students } = Global();
    const [data, setData] = useState(location.state.data);
    const [collapseData, setCollapseData] = useState([]);
    const [edit, setEdit] = useState(null);  

    const handleOpen = (item) => {
        navigate(`/${type}/${item._id}`, {state: {data: item}});
    }

    const handleBack = () => {
        navigate(`/${type}`);
    }

    const handleEdit = () => {
        setEdit(true);
    }

    const handleDelete = () => {
        axios.post('/deleteData', {
            collection: type.toLowerCase(),
            filter: {_id: data._id}
        }).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            toast.warning(err.response.data.message);
        });
    }

    useEffect(() => {
        setData(location.state.data);

        let collData = {};
        let lisData;

        if (type === 'Courses') {
            collData['id'] = data._id;
            collData['role'] = 0;
            lisData = students;
        } else {
            collData['id'] = data._id;
            collData['role'] = data.role;
            lisData = courses;
        }
        
        getUserCoursers(collData, lisData).then((res) => {
            setCollapseData(res);
        });
    }, [data, courses, students, location, setData, type]);

  return (
    <Box flexGrow={1}>
        <Grid container spacing={2}>
            <Grid item md={12}>
                <BlockContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton onClick={handleBack}>
                        <ArrowBackIosNewRoundedIcon />
                    </IconButton>
                    <Box display='flex'>
                        <Box sx={{'& > *' : { marginRight: 2}}} >
                            <IconButton onClick={() => setEdit(false)}>
                                <CloseRoundedIcon />
                            </IconButton>
                            <Button variant='contained' color='error' onClick={handleDelete}>Delete</Button>
                        </Box>
                        <Box>
                            <Button variant='contained' color='secondary' onClick={handleEdit}>Edit</Button>
                        </Box>
                    </Box>
                </BlockContent>
            </Grid>
            { edit ? (
                <Grid item md={12}>
                    <Block>
                        <Typography variant='h4' fontWeight='bold'>Edit {type}</Typography>
                        <UpdateDetails 
                            id={data._id}
                            type={type}
                            order={ type === 'Courses' ?
                                [
                                    {field: 'Course ID', label: 'Course ID', size: 6},
                                    {field: 'Course Title', label: 'Course Title', size: 6},
                                    {field: 'Course Description', label: 'Course Description', size: 12},
                                    {field: 'Classroom Number', label: 'Classroom Number', size: 6},
                                    {field: 'Capacity', label: 'Capacity', size: 6},
                                    {field: 'Credit Hours', label: 'Credit Hours', size: 6},
                                    {field: 'Tuition Cost', label: 'Tuition Cost', size: 6},
                                    {field: 'Available', label: 'Available', size: 6},
                                    {field: 'Teacher ID', label: 'Teacher ID', size: 6},
                                ] 
                            : 
                                [
                                    {field: 'fileDir', label: 'Profile', size: 12},
                                    {field: 'firstname', label: 'First Name', size: 6},
                                    {field: 'lastname', label: 'Lastname', size: 6},
                                    {field: 'username', label: 'Username', size: 6},
                                    {field: 'password', label: 'Password', size: 6},
                                    {field: 'role', label: 'Role', size: 6},
                                    {field: 'status', label: 'Status', size: 6},
                                    {field: 'email', label: 'Email', size: 4},
                                    {field: 'phone', label: 'Phone Number', size: 4},
                                    {field: 'dob', label: 'Date Of Birth', size: 4},
                                    {field: 'country', label: 'Country', size: 6},
                                    {field: 'city', label: 'City', size: 6},
                                    {field: 'address', label: 'Address', size: 12},
                                    {field: 'state', label: 'State', size: 6},
                                    {field: 'zipcode', label: 'Zipcode', size: 6},
                                ]
                            } 
                        />
                    </Block>
                </Grid>
            ) : (
                <>
                { columns.map((column, index) => (
                    <Grid item md={column.size} sm={column.size} xs={12} key={`column-${index}`}>
                        <Block sx={{ display: 'flex', flexDirection: column.direction, justifyContent: 'space-around', flexWrap: 'wrap'}}>
                            { column.content.map((field, index) => {
                                let response;
                                switch (field) {
                                    case 'fileDir':
                                        response = <Avatar key={index} src={data.fileDir} alt='profile' sx={{ width: 160, height: 160}}/>;
                                        break;
                                    case 'created':
                                        response = <BlockContent key={index}><Typography variant='h6' fontWeight='bold'>{capitalizeString(field)}:</Typography>
                                        <Typography>{ new Date(data[field]).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) }</Typography></BlockContent>
                                        break;
                                    case 'role':
                                        response = <Typography variant='h4' fontWeight='bold'>{ data.role === 1 ? 'Admin' : data.role === 2 ? 'Teacher' : data.role === 3 ? 'Student' : '' }</Typography>
                                        break;
                                    default:
                                        response = <BlockContent key={index}><Typography variant='h6' fontWeight='bold'>{capitalizeString(field)}:</Typography>
                                        <Typography>{ data[field] }</Typography></BlockContent>;
                                        break;
                                }
    
                                return response;
                            } )}
                        </Block>
                    </Grid>
                )) }
                { collapseData.length > 0 && (
                    <Grid item md={12}>
                        <Block>
                            <CollapseList 
                                title={collapse.title}
                                data={collapseData}
                                fields={collapse.fields}
                                handleOpen={handleOpen}
                            />
                        </Block>
                    </Grid>
                )}
                </>
            )}
        </Grid>
    </Box>
  )
}

export default Details