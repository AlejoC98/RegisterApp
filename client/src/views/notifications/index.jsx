import { Box, Grid } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { Block } from '../../components/global'
import { useLocation, useNavigate } from 'react-router-dom';
import UserRequest from '../admin/UserRequest';
import CollapseList from '../../components/CollapseList';
import axios from 'axios';
import { UserAuth } from '../../context/UserContext';
import { toast } from 'react-toastify';
import JoinCourseRequest from '../courses/JoinCourseRequest';

const Notification = () => {

    const { user } = UserAuth();
    const location = useLocation(null);
    const notiData = location.state ? location.state.data : '';
    const [notiComponent, setNotiComponent] = useState();
    const navigate = useNavigate();
    
    const loadContent = useCallback(() => {
        const handleOpen = (noti) => {
            navigate(`${noti.to}/${noti._id}`, { state: { data: noti}});
        }

        switch (notiData.type) {
            case 'users':
                setNotiComponent(<UserRequest data={notiData} />);
                break;
            case 'usercourses':
                setNotiComponent(<JoinCourseRequest data={notiData} />);
                break;
            default:
                axios.post('/getData', { 
                    collection: 'notifications',
                    filter: { role: user.role}
                }).then((res) => {
                    setNotiComponent(<CollapseList title='Notifications' data={res.data} fields={['title', 'subtitle',]} handleOpen={handleOpen}/>);
                }).catch((err) => toast.error(err));
                break;
        }
    }, [notiData, user, navigate]);

    useEffect(() => {
        loadContent();
    }, [loadContent]);

    return (
        <Box flexGrow={1}>
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <Block>
                        {notiComponent}
                    </Block>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Notification