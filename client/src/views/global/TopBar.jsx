import { AppBar, Avatar, Badge, Box, Divider, FormControlLabel, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, Menu, MenuItem, Paper, Switch, Toolbar, Typography, useTheme } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Link, useNavigate } from 'react-router-dom';
import { Global } from '../../context/GlobalContext';
import { getIconComponent } from '../../components/global';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserAuth } from '../../context/UserContext';
import CollapseList from '../../components/CollapseList';
import { ColorModeContext, tokens } from '../../theme';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#E8D33F',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
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

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  // borderRadius: theme.shape.borderRadius,
  borderRadius: 20,
  backgroundColor: theme.palette.mode === 'light' ? alpha(theme.palette.common.white, 1) : alpha('#45494e', 1),
  boxShadow: `5px 6px 12px -4px ${theme.palette.mode === 'light' ? 'rgba(156,156,156,0.75)' : 'rgba(43,43,43,0.75)'}`,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? alpha(theme.palette.common.white, 0.60) : alpha('#45494e', 0.60),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? '#000' : '#fff',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
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

  const { notifications, courses, students, teachers } = Global();
  const { user } = UserAuth();
  const navigate = useNavigate();
  const currentDate = new Date();
  const searchInputRef = useRef();
  const displaNotifications = notifications.slice(0, 5);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [searchData, setSearchData] = useState([]);
  const [searching, setSearching] = useState(false);
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const menuId = 'notification-menu';

  useEffect(() => {
    if (notifications.length > 0) {
      console.log(notifications);
    }
  }, [notifications]);

  const handleSearch = (e) => {
    let keyWord = e.target.value.toLowerCase();
    let allData = user.role === 1 ? [...courses, ...students, ...teachers]: user.role === 2 ? [...courses, ...students, ...teachers] : user.role === 3 ? [...courses, ...teachers] : [];
    let results = [];
  
    if (keyWord !== '') {
      allData.forEach((value) => {
        try {
          const propertiesToCheck = ['Course Title', 'Course ID', 'firstname', 'lastname', 'email'];
          for (const property of propertiesToCheck) {
            const v = value[property];
            if (v !== null && v !== undefined) {
              const stringValue = v.toString().toLowerCase();
              if (stringValue.includes(keyWord)) {
                if (!results.find(d => d.data._id === value._id)) {
                  if (property === 'firstname' || property === 'lastname') {
                    results.push({ 
                      title: `${value.firstname} ${value.lastname}`, 
                      sub: value.email, 
                      link: value.role === 2 ? `/Teachers/${value._id}` : `/Students/${value._id}`, 
                      data: value 
                    });
                  } else {
                    results.push({ 
                      title: value['Course Title'], 
                      sub: value['Course ID'], 
                      link: `/Courses/${value._id}`, 
                      data: value 
                    });
                  }
                }
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
    setSearchData(results);
  }  

  const handleOpenSearch = (item) => {
    navigate(item.link, { state: { data: item.data } });
    handleCloseSearch();
  }

  const handleCloseSearch = () => {
    setSearching(false);
    searchInputRef.current.querySelector('input').value = '';
  }

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
              filter: { _id: noti.reference }
            }).then((res) => {
              if (res.data) {
                navigate(`${noti.to}/${noti.reference}`, { state: { data: res.data[0] } });
              }
            }).catch((err) => toast.warning(err));
            break;
          default:
            navigate(`${noti.to}/${noti._id}`, { state: { data: noti } });
            break;
        }
      }
    }).catch((err) => toast.error(err));
  }
  
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
      sx={{ '.MuiMenu-paper': 
        {
          backgroundColor: theme.palette.mode === 'light' ? colors.ghostWhite[500] : colors.richBlack[500],
        }
      }}
    >
      {displaNotifications.length > 0 ? (
        <Paper sx={{
          maxHeight: 200,
          minWidth: 200,
          maxWidth: 270,
          overflowY: 'auto',
        }}>
          {displaNotifications.map((noti) => (
            <MenuItem 
              onClick={() => handleOpenNoti(noti)}
              key={noti._id} 
              sx={{ 
                backgroundColor: 
                  noti.open ? 
                    theme.palette.mode === 'light' ? colors.richBlack[900] : colors.richBlack[400] 
                  : theme.palette.mode === 'light' ? colors.ghostWhite[400] : colors.richBlack[600]
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  {getIconComponent(noti.icon)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={noti.title} secondary={noti.subtitle.slice(0, 26)} />
            </MenuItem>
          ))}
        </Paper>
      ) : (
        <ListItem sx={{ textAlign: 'center', color: '#d1d1d1' }}>
          <ListItemText primary='Empty' />
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
          <Box className='date-section' sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Typography 
              variant='h6' 
              color='primary'
            >
              {currentDate.toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric' 
              })}
            </Typography>
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
                  onKeyUp={handleSearch}
                  onFocus={() => setSearching(true)}
                  ref={searchInputRef}
                />
                <Box
                  position='absolute'
                  zIndex={10000000}
                  top={0}
                  right={0}
                  display={searching ? 'flex' : 'none'}
                  alignItems='center'
                >
                  <IconButton 
                    onClick={handleCloseSearch} 
                    sx={{ '& :hover > *': { color: '#000', cursor: 'pointer' } }}
                  >
                    <CloseRoundedIcon
                      sx={{ color: '#c2c2c2' }}
                    />
                  </IconButton>
                </Box>
                <Box
                  display={searching && searchData.length > 0 ? 'flex' : 'none'}
                  position='absolute'
                  backgroundColor={
                    theme.palette.mode === 'light' ? colors.ghostWhite[500] : colors.richBlack[400]
                  }
                  left={15}
                  width='90%'
                  mt={1}
                  borderRadius='0 0 10px 10px'
                  boxShadow={`3px 5px 5px 0px ${theme.palette.mode === 'light' ? 'rgba(156,156,156,0.75)' : 'rgba(43,43,43,0.75)'}`}
                  maxHeight={200}
                  overflow='scroll'
                >
                  <CollapseList
                    title=''
                    data={searchData}
                    fields={['title', 'sub']}
                    handleOpen={handleOpenSearch}
                  />
                </Box>
              </Search>
            </Box>
            <Box className='action-icons' sx={{ display: { md: 'flex', sm: 'none', xs: 'none' } }}>
              <FormControlLabel
                control={<MaterialUISwitch sx={{ m: 1 }} />}
                onClick={colorMode.toggleColorMode}
              />
              <IconButton
                edge='end'
                aria-label='Notifications'
                aria-controls={menuId}
                aria-haspopup='true'
                onClick={handleNotificationMenuOpen}
              >
                {/* <Badge badgeContent={notifications.filter(n => n.open === false).length} color='error'> */}
                <Badge badgeContent={notifications.length} color='error'>
                  <NotificationsRoundedIcon color='primary' />
                </Badge>
              </IconButton>
              <IconButton LinkComponent={Link} to='/Account'>
                <Avatar src={user.fileDir} alt={user.firstname} />
              </IconButton>
            </Box>
            <Box className='hide-action-icons' sx={{ display: { md: 'none', sm: 'flex', xs: 'flex' } }}>
              <MoreVertRoundedIcon color='primary' />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      { notificationMenu }
    </Box>
  )
}

export default TopBar