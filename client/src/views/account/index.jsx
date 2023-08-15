import { Avatar, Box, Button, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Block, BlockContent } from '../../components/global'
import { UserAuth } from '../../context/UserContext';
import { Global } from '../../context/GlobalContext';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { tokens } from '../../theme';
import UpdatePasswordForm from '../../components/forms/UpdatePasswordForm';
import UpdateProfileForm from '../../components/forms/UpdateProfileForm';
import UpdateAddressForm from '../../components/forms/UpdateAddressForm';
import UpdateContactForm from '../../components/forms/UpdateContactForm';
import CollapseList from '../../components/CollapseList';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const MenuItem = ({ title, selected, setSelected, colors}) => {
  return (
    <ListItem>
      <ListItemButton 
        onClick={() => setSelected(title)} 
        selected={selected === title} 
        sx={{ 
          borderRadius: 50, 
          color: selected === title ? colors.bleuDeFrance[500] : '#c2c2c2'
        }}
      >
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  )
}

const Account = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = UserAuth();
  const { roles, courses } = Global();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const active = location.state ? location.state.active : 'My Profile';
  const [selected, setSelected] = useState(active);
  const user_role = roles.find(r => r.type === user.role);
  const menus = ['My Profile', 'Security', user.role === 3 || user.role === 2 ? 'Courses' : ''];
  const [displayCourses, setDisplayCourses] = useState([]);

  const handleOpenCourses = (course) => {
    navigate(`/Courses/${course._id}`, {state: {data: course}});
  }

  useEffect(() => {
    if (user.role !== 1) {
      axios.post('/getData', {
        collection: 'usercourses',
        filter: {user_id: user._id, status: 'Accepted'}
    }).then((res) => {
        if (res.data) {
            res.data.forEach((course) => {
              setDisplayCourses((prev) => [...prev, courses.find(c => c['_id'] === course.course_id)]);
            });
        }
    }).catch((err) => toast.warning(err));
    }
  }, [user, courses]);

  return (
    <Box flexGrow={1} className='animate__animated animate__zoomIn animate__faster'>
      <Box pl={2} mb={2}>
        <Typography variant='h5' fontWeight='bold'> Account Settings</Typography>
      </Box>
      <Block>
        <Grid container spacing={2} sx={{ pb: 0 }}>
          <Grid item xs={12} md={3} lg={2} sx={{ borderRight: { md: '1px solid #d2d2d2' } }}>
            <BlockContent>
              <List>
                { menus.map((m, i) => (
                  <MenuItem 
                    key={i}
                    title={m}
                    selected={selected}
                    setSelected={setSelected}
                    colors={colors}
                  />
                ))}
              </List>
            </BlockContent>
          </Grid>
          <Grid item xs={12} md={9} lg={10}>
            <BlockContent>
              <Box mb={2} display='flex' alignItems='center'>
                {selected.includes('Update') && (
                  <IconButton onClick={() => setSelected('My Profile')}>
                    <ArrowBackIosNewRoundedIcon />
                  </IconButton>
                )}
                <Typography variant='h5' fontWeight='bold' align='left'>{selected}</Typography>
              </Box>
              {selected === 'My Profile' ? (
                <Box>
                  <Box className='bordered-box' flexGrow={1}>
                    <Grid container spacing={2}>
                      <Grid item md={3} lg={1}>
                        <BlockContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                          <Avatar sx={{ width: 100, height: 100 }} src={user.fileDir} alt='profile' />
                        </BlockContent>
                      </Grid>
                      <Grid item md={7} lg={9}>
                        <BlockContent>
                          <Typography align='left' fontWeight='bold'>{user.firstname} {user.lastname}</Typography>
                          <Typography align='left'>{user.username}</Typography>
                          <Typography align='left'>{user_role.name}</Typography>
                          <Typography align='left'>DOB: {user.dob}</Typography>
                        </BlockContent>
                      </Grid>
                      <Grid item md={2} lg={2}>
                        <BlockContent>
                          <Button variant='outlined' onClick={() => setSelected('Update Profile')}>Edit</Button>
                        </BlockContent>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className='bordered-box' flexGrow={1}>
                    <Typography variant='h6' fontWeight='bold' align='left'>Contact Information</Typography>
                    <Grid container spacing={2}>
                      <Grid item md={5} sm={12}>
                        <BlockContent>
                          <Box mb={2}>
                            <Typography align='left'>Email address</Typography>
                            <Typography fontWeight='bold' align='left'>{user.email}</Typography>
                          </Box>
                        </BlockContent>
                      </Grid>
                      <Grid item md={5} sm={12}>
                        <BlockContent>
                          <Box mb={2}>
                            <Typography align='left'>Phone Number</Typography>
                            <Typography fontWeight='bold' align='left'>{user.phone}</Typography>
                          </Box>
                        </BlockContent>
                      </Grid>
                      <Grid item md={2} sm={12}>
                        <BlockContent>
                          <Button variant='outlined' onClick={() => setSelected('Update Contact')}>Edit</Button>
                        </BlockContent>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className='bordered-box' flexGrow={1}>
                    <Typography variant='h6' fontWeight='bold' align='left'>Address</Typography>
                    <Grid container spacing={2}>
                      <Grid item md={5}>
                        <BlockContent>
                          <Box mb={2}>
                            <Typography align='left'>Country</Typography>
                            <Typography fontWeight='bold' align='left'>{user.country || 'United States'}</Typography>
                          </Box>
                          <Box mb={2}>
                            <Typography align='left'>Postal Code</Typography>
                            <Typography fontWeight='bold' align='left'>{user.zipcode || '84081'}</Typography>
                          </Box>
                        </BlockContent>
                      </Grid>
                      <Grid item md={5}>
                        <BlockContent>
                          <Box mb={2}>
                            <Typography align='left'>City/State</Typography>
                            <Typography fontWeight='bold' align='left'>{user.city ? `${user.city}, ${user.state}` : 'Lehi, Utah'}</Typography>
                          </Box>
                          <Box mb={2}>
                            <Typography align='left'>Street</Typography>
                            <Typography fontWeight='bold' align='left'>{user.address || 'Tmp 123'}</Typography>
                          </Box>
                        </BlockContent>
                      </Grid>
                      <Grid item md={2}>
                        <BlockContent>
                          <Button variant='outlined' onClick={() => setSelected('Update Address')}>Edit</Button>
                        </BlockContent>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              ) : selected === 'Security' ? (
                <Box className='bordered-box' flexGrow={1}>
                  <Typography variant='h6' fontWeight='bold' align='left'>Update Password</Typography>
                  <UpdatePasswordForm />
                </Box>
              ) : selected === 'Courses' ? (
                <Box>
                  { displayCourses.length > 0 ? (
                    <CollapseList 
                      title=''
                      data={displayCourses}
                      fields={['Course Title', 'Classroom Number']}
                      handleOpen={handleOpenCourses}
                    />
                  ) : (
                    <Typography variant='h4'>You are not registered for any courses at this moment!</Typography>
                  )}
                </Box>
              ) : (
                <Box>
                  {selected === 'Update Profile' && (
                    <UpdateProfileForm setSelected={setSelected} />
                  )}
                  {selected === 'Update Contact' && (
                    <UpdateContactForm setSelected={setSelected} />
                  )}
                  {selected === 'Update Address' && (
                    <UpdateAddressForm setSelected={setSelected} />
                  )}
                </Box>
              )}
            </BlockContent>
          </Grid>
        </Grid>
      </Block>
    </Box>
  )
}

export default Account