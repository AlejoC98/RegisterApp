import React, {} from 'react';
import { Box } from '@mui/material'
import BasicTable from '../../components/BasicTable';
import DialogModal from '../../components/DialogModal';
import UploadFileForm from '../../components/forms/UploadFileForm';
import { Global } from '../../context/GlobalContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/UserContext';
import CoursesForm from '../../components/forms/CoursesForm';

const Courses = () => {

  const { user } = UserAuth();
  const { courses } = Global();
  const location = useLocation(null);
  const navigate = useNavigate();

  const handleOpen = (data) => {
    let mainPath = location.pathname.split('/')[1];
    navigate(`/${mainPath}/${data._id}`, { state: { data: data }});
  }

  return (
    <Box flexGrow={1} className='animate__animated animate__zoomIn animate__faster'>
      <BasicTable
        title='Courses'
        actions={ user.role === 1 ? [<DialogModal title='Import File' buttonText='Upload' buttonColor='secondary' content={<UploadFileForm />} />, <DialogModal title='Create Course' buttonText='New Course' buttonColor='success' content={<CoursesForm />} />] : undefined }
        headers={['Course ID', 'Course Title', 'Course Description', 'Classroom Number', 'Capacity', 'Credit Hours', 'Tuition Cost']}
        data={courses}
        fields={['Course ID', 'Course Title', 'Course Description', 'Classroom Number', 'Capacity', 'Credit Hours', 'Tuition Cost']}
        color=''
        handleOpen={handleOpen}
      />
    </Box>
  )
}

export default Courses