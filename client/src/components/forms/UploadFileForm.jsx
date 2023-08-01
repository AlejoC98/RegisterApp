import { Box, Button, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import axios from 'axios';
import { Global } from '../../context/GlobalContext';
import { toast } from 'react-toastify';

const UploadFileForm = () => {

    const { getData } = Global();
    const fileInputRef = useRef(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [errors, setErrors] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('file', uploadFile);
        formData.append('collection', 'courses');

        axios.post('/createData', formData).then((res) => {
            console.log(res.data.status);
            if (res.data.status) {
                getData();
                toast.success(res.data.message);
                setUploadFile(null);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const handleOpenFile = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        if (e.target.files[0].type === 'text/csv') {
            setErrors('');
            setUploadFile(e.target.files[0]);
        } else {
            setUploadFile(null);
            setErrors('File type is not valid!');
            setTimeout(() => {
                setErrors('');
            }, 2000);
            e.target.value = '';
        }
    }

    return (
        <Box flexGrow={1} p={2}>
            <form onSubmit={handleSubmit}>
                <Box display='flex' justifyContent='center' flexDirection='column' alignItems='center' border='3px dotted #e9ebec' p={3} borderRadius={1} sx={{
                    '& > ': {
                        marginTop: 2
                    }
                }}>
                    <Box className='column-center-block' display='flex' alignItems='center' flexDirection='column'>
                        <UploadFileRoundedIcon fontSize='large' sx={{ mt: 2 }} />
                        <Typography sx={{ mt: 2 }}>Select a file or drag here</Typography>
                        <Typography sx={{ mt: 2 }}>{ uploadFile !== null ? uploadFile.name : '' }</Typography>
                    </Box>
                    <Box className='column-center-block'>
                        <Button variant='contained' color='secondary' sx={{ mt: 2 }} onClick={handleOpenFile}>Select File</Button>
                        <Typography sx={{ mt:2, color: 'red', transition: 'all ease .5s'}}>{ errors }</Typography>
                        <input type='file' hidden ref={fileInputRef} onChange={handleFileChange} />
                    </Box>
                    <Button type='submit' color='info' sx={{ mt: 1}}>Upload</Button>
                </Box>
            </form>
        </Box>
    )
}

export default UploadFileForm