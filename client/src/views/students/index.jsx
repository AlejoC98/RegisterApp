import React, {} from 'react';
import { Box } from '@mui/material';
import { Global } from '../../context/GlobalContext';
import BasicTable from '../../components/BasicTable';
import DialogModal from '../../components/DialogModal';
import RegisterForm from '../../components/forms/RegisterForm';
import { UserAuth } from '../../context/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Students = () => {

  const { user } = UserAuth();
  const { students } = Global();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpen = (data) => {
    let mainPath = location.pathname.split('/')[1];
    navigate(`/${mainPath}/${data._id}`, { state: { data: data }});
  }

  return (
    <Box flexGrow={1}>
      <BasicTable
        title='Students' 
        actions={user.role === 1 ? [<DialogModal title='New Student' buttonText='New Student' buttonColor='secondary' content={<RegisterForm type={3} />} />] : undefined}
        headers={['Firstname', 'Lastname', 'Username', 'Email', 'Phone']}
        data={students}
        fields={['firstname', 'lastname', 'username', 'email', 'phone']}
        color=''
        handleOpen={handleOpen}
      />
    </Box>
  )
}

export default Students