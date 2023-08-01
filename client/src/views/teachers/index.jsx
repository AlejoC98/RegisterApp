import React from 'react'
import { Global } from '../../context/GlobalContext'
import { Box } from '@mui/material';
import BasicTable from '../../components/BasicTable';
import { useLocation, useNavigate } from 'react-router-dom';
import DialogModal from '../../components/DialogModal';
import RegisterForm from '../../components/forms/RegisterForm';
import { UserAuth } from '../../context/UserContext';

const Teachers = () => {

  const { user } = UserAuth();
  const { teachers } = Global();
  const location = useLocation(null);
  const navigate = useNavigate();

  const handleOpen = (data) => {
    let mainPath = location.pathname.split('/')[1];
    navigate(`/${mainPath}/${data._id}`, { state: { data: data }});
  }

  return (
    <Box flexGrow={1}>
      <BasicTable
        title='Teachers' 
        actions={user.role === 1 ? [<DialogModal title='New Teacher' buttonText='New Teacher' buttonColor='secondary' content={<RegisterForm type={2} />} />] : undefined}
        headers={['Firstname', 'Lastname', 'Username', 'Email', 'Phone']}
        data={teachers}
        fields={['firstname', 'lastname', 'username', 'email', 'phone']}
        color=''
        handleOpen={handleOpen}
      />
    </Box>
  )
}

export default Teachers