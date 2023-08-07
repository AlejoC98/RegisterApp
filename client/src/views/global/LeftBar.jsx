import { Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import logo from '../../assets/images/Logo.png';
// import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import axios from 'axios';
import { UserAuth } from '../../context/UserContext';
import { toast } from 'react-toastify';
import { Global } from '../../context/GlobalContext';
import { getIconComponent } from '../../components/global';
import { tokens } from '../../theme';

const Item = ({ title, to, icon, selected, setSelected }) => {
    return (
      <ListItemButton
        component={Link}
        to={to}
        selected={selected === title}
        onClick={() => setSelected(title)}
      >
        <ListItemIcon sx={{ color: selected === title ? '#2987F0' : ''}}>
          {icon}
        </ListItemIcon>
        <ListItemText primary={ title } />
      </ListItemButton>
    );
  };

const LeftBar = ({ collapse, handleCollapse }) => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState("Dashboard");
    const { setUserToken } = UserAuth();
    const { menus } = Global();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleLogOut = () => {
        axios.post('/auth/logout').then((res) => {
            if (res.data.message) {
              setUserToken(false);
              navigate('/Login');
              setTimeout(() => {
                toast('Come back soon!');
              }, 300);
            }
        }).catch((err) => toast.error(err.message));
    }

  return (
    <Box className={`sidebar ${collapse ? 'close' : 'open'}`} backgroundColor={ theme.palette.mode === 'light' ? '#ffffff' : colors.richBlack[600]}>
        <Box>
            <IconButton onClick={handleCollapse} color='primary'>
                <MenuRoundedIcon />
            </IconButton>
        </Box>
        <Box className='logo-section'>
            <img src={logo} alt='logo' width={collapse ? 60 : 90}/>
        </Box>
        <Box className='action-menu-section'>
            <List className='menu'>
                { menus.map((menu, key) => (
                    <Item 
                        key={key}
                        title={menu.name}
                        to={menu.to}
                        icon={ getIconComponent(menu.icon)}
                        selected={selected}
                        setSelected={setSelected}
                    />
                ))}
            </List>
        </Box>
        <Box className='bottom-menu-section'>
            <List className='menu'>
                {/* <ListItemButton LinkComponent={Link} to='/Settings'>
                    <ListItemIcon>
                        <SettingsRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary='Settings' />
                </ListItemButton> */}
                <ListItemButton onClick={handleLogOut}>
                    <ListItemIcon>
                        <LogoutRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary='LogOut' />
                </ListItemButton>
            </List>
        </Box>
    </Box>
  )
}

export default LeftBar