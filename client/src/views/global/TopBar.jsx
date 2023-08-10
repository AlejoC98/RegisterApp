import { AppBar, Avatar, Badge, Box, Divider, FormControlLabel, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, Menu, MenuItem, Paper, Toolbar, Typography, useTheme } from '@mui/material'
import React, { useContext, useRef, useState } from 'react';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { alpha } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Link, useNavigate } from 'react-router-dom';
import { Global } from '../../context/GlobalContext';
import { getIconComponent, Search, SearchIconWrapper, StyledInputBase, MaterialUISwitch } from '../../components/global';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserAuth } from '../../context/UserContext';
import CollapseList from '../../components/CollapseList';
import { ColorModeContext, tokens } from '../../theme';

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
              console.log(notifications);
              console.log(notifications.find(n => n._id === noti._id));
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
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiList-root': {
          padding: 0
        },
        '& .MuiMenu-paper': 
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
                    theme.palette.mode === 'light' ? alpha(colors.richBlack[400], 0.10) : alpha(colors.richBlack[400], 0.40) 
                  : theme.palette.mode === 'light' ? colors.ghostWhite[500] : colors.richBlack[400]
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
                <Badge badgeContent={notifications.filter(n => n.open === false).length} color='error'>
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