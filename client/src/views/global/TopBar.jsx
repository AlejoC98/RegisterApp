import { AppBar, Avatar, Badge, Box, Divider, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, Menu, MenuItem, Paper, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Link, useNavigate } from 'react-router-dom';
import { Global } from '../../context/GlobalContext';
import { getIconComponent } from '../../components/global';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserAuth } from '../../context/UserContext';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  // borderRadius: theme.shape.borderRadius,
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.common.white, 1),
  boxShadow: '5px 5px 12px -4px rgba(148,148,148,1)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.60),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '25ch',
      },
    },
  },
}));

const TopBar = () => {

  const currentDate = new Date();
  const { notifications } = Global();
  const { user } = UserAuth();
  const displaNotifications = notifications.slice(0, 5);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleNotificationMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenNoti = (noti) => {
    handleMenuClose();
    noti.open = true;
    axios.post('/updateData', {
      collection: 'notifications',
      values: noti
    }).then((res) => {
      if (res.data.status) {
        switch (noti.type) {
          case 'course':
          axios.post('/getData', {
            collection: 'courses',
            filter: { _id: noti.reference}
          }).then((res) => {
            if (res.data) {
              navigate(`${noti.to}/${noti.reference}`, { state: { data: res.data[0]}});
            }
          }).catch((err) => toast.warning(err));
            break;
          default:
            navigate(`${noti.to}/${noti._id}`, { state: { data: noti}});
            break;
        }
      }
    }).catch((err) => toast.error(err));
  }

  const menuId = 'notification-menu';
  const notificationMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      { displaNotifications.length > 0 ? (
        <Paper sx={{
          maxHeight: 200,
          minWidth: 200,
          maxWidth: 250,
          // overflowY: 'scroll',
        }}>
          {displaNotifications.map((noti) => (
            <MenuItem onClick={() => handleOpenNoti(noti) } key={noti._id} sx={{ backgroundColor: noti.open ? '#e2e2e2' : '#ffffff'}}>
              <ListItemAvatar>
                <Avatar>
                  { getIconComponent(noti.icon) }
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={noti.title} secondary={noti.subtitle.slice(0, 26)} />
            </MenuItem>
          ))}
        </Paper>
      ) : (
        <ListItem sx={{ textAlign: 'center', color: '#d1d1d1'}}>
          <ListItemText primary='Empty'/>
        </ListItem>
      )}
      <Divider />
      <MenuItem>
        <ListItemButton LinkComponent={Link} to='/Notifications'>
          <ListItemText primary='See all' />
        </ListItemButton>
      </MenuItem>
    </Menu>
  );

  return (
    <Box flexGrow={1}>
      <AppBar position='static' className='topbar'>
        <Toolbar>
        <Box className='date-section' sx={{ display: { xs: 'none', sm: 'flex'}}}>
          <Typography variant='h6' color='primary'>{currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box className='action-section'>
          <Box className='search-section' display='flex'>
            <Search>
              <SearchIconWrapper>
                <SearchRoundedIcon color='primary' />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>
          <Box className='action-icons' sx={{ display: { md: 'flex', sm: 'none', xs: 'none' } }}>
            <IconButton
              edge='end'
              aria-label='Notifications'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={notifications.filter(n => n.open === false).length} color='error'>
                <NotificationsRoundedIcon color='primary' />
              </Badge>
            </IconButton>
            <IconButton LinkComponent={Link} to='/Account'>
              <Avatar src={user.fileDir} alt={user.firstname} />
              {/* <Avatar src='../../assets/images/default-profile.png' alt='Alejandro' /> */}
              {/* {user.fileDir} */}
            </IconButton>
          </Box>
          <Box className='hide-action-icons' sx={{ display: { md: 'none', sm: 'flex', xs: 'flex' } }}>
            <MoreVertRoundedIcon color='primary' />
          </Box>
        </Box>
        </Toolbar>
      </AppBar>
      {notificationMenu}
    </Box>
  )
}

export default TopBar