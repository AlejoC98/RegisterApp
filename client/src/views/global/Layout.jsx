import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from '../../theme';
import { Outlet } from 'react-router-dom';
import LeftBar from './LeftBar';
import TopBar from './TopBar';
import { ToastContainer } from 'react-toastify';
import { Puff } from 'react-loader-spinner'

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
                    <Box className='loading-container'>
                        <Puff
                            height="130"
                            width="130"
                            radius={1}
                            color="#388697"
                            ariaLabel="puff-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    </Box>
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
                        theme={theme.palette.mode}
                    />
                    <LeftBar collapse={collapse} handleCollapse={handleCollapse} />
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

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box className='auth-container'>
                    <Box className='loading-container'>
                        <Puff
                            height="130"
                            width="130"
                            radius={1}
                            color="#388697"
                            ariaLabel="puff-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    </Box>
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
                        theme={theme.palette.mode}
                    />
                    <Outlet />
                </Box>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export { AppLayout, AuthLayout }