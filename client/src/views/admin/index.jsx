import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Block } from '../../components/global'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Admin = () => {

  const [count, setCount] = useState(1);

  const handleNewNoti = () => {
    axios.post('/createData', {
      collection: 'notifications',
      values: {
        title: 'Test', 
        subtitle: 'Im testing it',
        to: '/Notifications', 
        icon: 'PersonRounded', 
        role: 3, 
        open: false, 
        status: 'Pending', 
        reference: '64b9b5f170a1fc450b0717b2', 
        type: 'users', 
        user_id: ''
      }
    }).then((res) => {
      // console.log(res.data);
      setCount(count + 1);
    }).catch((err) => toast.error(err));
  }

  return (
    <Box flexGrow={1}>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <Block>
            <Box m={2}>
            <Typography variant='h4'>Action Center</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', margin: '20px 0'}}>
              <Button 
                LinkComponent={Link} 
                to='/Admin/Menus' 
                variant='contained' 
                color='success'
              >
                Menu
              </Button>
              <Button 
                LinkComponent={Link} 
                to='/Admin/Teachers' 
                variant='contained' 
                color='info'
              >
                Teachers
              </Button>
              <Button 
                LinkComponent={Link} 
                to='/Admin/Students' 
                variant='contained' 
                color='warning'
              >
                Students
              </Button>
              <Button 
                LinkComponent={Link} 
                to='/Admin/Courses' 
                variant='contained' 
                color='error'
              >
                Courses
              </Button>
              <Button 
                variant='contained' 
                color='secondary'
                onClick={handleNewNoti}
              >
                Test Notification
              </Button>
            </Box>
          </Block>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Admin