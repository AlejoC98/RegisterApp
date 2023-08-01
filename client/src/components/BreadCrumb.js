import { Breadcrumbs, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const BreadCrumb = ({ path }) => {

    const Navigate = useNavigate();
    const pathname = path.split('/').filter(Boolean);

    function handleLink(link) {
        Navigate(`/${link}`);
    }

    return (
        <Breadcrumbs>
            { path.split('/').map((link, index) => {
                if (index === pathname.length) {
                    return <Typography key={index} color='text.primary'>{ link }</Typography>;
                } else {
                    return <Typography key={index} sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer'}}} onClick={() => handleLink(link)}>{ link }</Typography>;
                    // return <Link key={index} underline='hover' color='inherit' href={to}> {link} </Link>;
                }
            }) }
        </Breadcrumbs>
    )
}

export default BreadCrumb