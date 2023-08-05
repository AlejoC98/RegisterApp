import { Avatar, Box, Button, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { Block, BlockContent } from '../../components/global'
import { UserAuth } from '../../context/UserContext';
import { Global } from '../../context/GlobalContext';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { tokens } from '../../theme';
import UpdatePasswordForm from '../../components/forms/UpdatePasswordForm';
import UpdateProfileForm from '../../components/forms/UpdateProfileForm';
import UpdateAddressForm from '../../components/forms/UpdateAddressForm';
import UpdateContactForm from '../../components/forms/UpdateContactForm';

const Account = () => {

  const { user } = UserAuth();
  const { roles } = Global();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState('My Profile');
  const [edit, setEdit] = useState();
  const user_role = roles.find(r => r.type === user.role);


  return (
    <Box flexGrow={1}>
      <Box pl={2} mb={2}>
        <Typography variant='h5' fontWeight='bold'> Account Settings</Typography>
      </Box>
      <Block>
        <Grid container spacing={2} sx={{ pb: 0 }}>
          <Grid item xs={12} md={3} sx={{ borderRight: { md: '1px solid #d2d2d2' } }}>
            <BlockContent>
              <List>
                <ListItem>
                  <ListItemButton onClick={() => setSelected('My Profile')} selected={selected === 'My Profile'} sx={{ borderRadius: 50, color: selected === 'My Profile' ? colors.bleuDeFrance[500] : '#c2c2c2' }}>
                    <ListItemText primary='My Profile' />
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton onClick={() => setSelected('Security')} selected={selected === 'Security'} sx={{ borderRadius: 50, color: selected === 'Security' ? colors.bleuDeFrance[500] : '#c2c2c2' }}>
                    <ListItemText primary='Security' />
                  </ListItemButton>
                </ListItem>
              </List>
            </BlockContent>
          </Grid>
          <Grid item xs={12} md={9}>
            <BlockContent>
              <Box mb={2} display='flex' alignItems='center'>
                { selected.includes('Update') && (
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
                      <Grid item md={3}>
                        <BlockContent>
                          <Avatar sx={{ width: 100, height: 100 }} src={user.fileDir} alt='profile' />
                        </BlockContent>
                      </Grid>
                      <Grid item md={7}>
                        <BlockContent>
                          <Typography align='left' fontWeight='bold'>{user.firstname} {user.lastname}</Typography>
                          <Typography align='left'>{ user.username }</Typography>
                          <Typography align='left'>{ user_role.name }</Typography>
                          <Typography align='left'>DOB: { user.dob }</Typography>
                        </BlockContent>
                      </Grid>
                      <Grid item md={2}>
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
                            <Typography fontWeight='bold' align='left'>United States</Typography>
                          </Box>
                          <Box mb={2}>
                            <Typography align='left'>Postal Code</Typography>
                            <Typography fontWeight='bold' align='left'>84081</Typography>
                          </Box>
                        </BlockContent>
                      </Grid>
                      <Grid item md={5}>
                        <BlockContent>
                          <Box mb={2}>
                            <Typography align='left'>City/State</Typography>
                            <Typography fontWeight='bold' align='left'>West Jordan, Utah</Typography>
                          </Box>
                          <Box mb={2}>
                            <Typography align='left'>Street</Typography>
                            <Typography fontWeight='bold' align='left'>{user.address}</Typography>
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
              ) : (
                <Box>
                  { selected === 'Update Profile' && (
                    <UpdateProfileForm setSelected={setSelected}/>
                  )}
                  { selected === 'Update Contact' && (
                    <UpdateContactForm setSelected={setSelected} />
                  )}
                  { selected === 'Update Address' && (
                    <UpdateAddressForm />
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