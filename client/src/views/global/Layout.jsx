import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from '../../theme';
import { Outlet } from 'react-router-dom';
import LeftBar from './LeftBar';
import TopBar from './TopBar';
import { ToastContainer } from 'react-toastify';

const AppLayout = () => {
    const [theme, colorMode] = useMode();
    const [collapse, setCollapse] = useState(true);

    const handleCollapse = () => {
        setCollapse(!collapse);
    }

  return (
    <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box className='app-container'>
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <LeftBar collapse={collapse} handleCollapse={handleCollapse}/>
                <main className={`content ${collapse ? 'close' : 'open'}`}>
                    <TopBar />
                    <Box className='container'>
                        <Outlet />
                    </Box>
                </main>
            </Box>
        </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

const AuthLayout = () => {
    const [theme, colorMode] = useMode();

    // const {background} = theme.palette;

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box className='auth-container'>
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                    <Outlet />
                </Box>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export { AppLayout, AuthLayout }