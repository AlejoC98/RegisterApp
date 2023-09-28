import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { Global } from '../../context/GlobalContext';
import { BlockContent, calculateStudentTuitions, getNextHoliday, monthsMap } from '../../components/global';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import WorkHistoryRoundedIcon from '@mui/icons-material/WorkHistoryRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import InfoBlocks from '../../components/InfoBlocks';
import { UserAuth } from '../../context/UserContext';
import LineChart from '../../components/LineChart';
import PieChart from '../../components/PieChart';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { user } = UserAuth();
  const { students, teachers, courses, userCourses } = Global();
  const [grossIncome, setGrossIncome] = useState(0);
  const [userLineChart, setUserLineChart] = useState([]);
  const [userPieChart, setUserPieChart] = useState({ data: [], fill: []});
  const [nextHoliday, setNextHoliday] = useState('');

  const infoBlockData = [
    ...(user.role === 1 ? [
      {
        icon: <ListAltRoundedIcon sx={{ fontSize: { lg: 40, md: 40, sm: 30, xs: 30}}}/>,
        title: 'Courses',
        text: courses.length,
        color: theme.palette.mode === 'light' ? colors.richBlack[500] : colors.ghostWhite[400],
        action: () => navigate('/Courses')
      },
      {
        icon: <Diversity3RoundedIcon sx={{ fontSize: { lg: 40, md: 40, sm: 30, xs: 30}}}/>,
        title: 'Students',
        text: students.length,
        color: theme.palette.mode === 'light' ? colors.richBlack[500] : colors.ghostWhite[400],
        action: () =>  navigate('/Students')
      },
      {
        icon: <Groups2RoundedIcon sx={{ fontSize: { lg: 40, md: 40, sm: 30, xs: 30}}}/>,
        title: 'Teachers',
        text: teachers.length,
        color: theme.palette.mode === 'light' ? colors.richBlack[500] : colors.ghostWhite[400],
        action: () =>  navigate('/Teachers')
      },
      {
        icon: <AttachMoneyRoundedIcon sx={{ fontSize: { lg: 40, md: 40, sm: 30, xs: 30}}}/>,
        title: 'Gross Income',
        text: grossIncome.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        color: theme.palette.mode === 'light' ? colors.richBlack[500] : colors.ghostWhite[400],
        action: () => {}
      },
    ] : user.role === 2 ? [
      {
        icon: <AssignmentRoundedIcon sx={{ fontSize: { lg: 40, md: 40, sm: 30, xs: 30}}}/>,
        title: 'Assined Classes',
        text: userCourses.length,
        color: theme.palette.mode === 'light' ? colors.richBlack[500] : colors.ghostWhite[400],
        action: () => navigate('/Account', { state: { active: 'Courses' }})
      },
      {
        icon: <CalendarMonthRoundedIcon sx={{ fontSize: { lg: 40, md: 40, sm: 30, xs: 30}}}/>,
        title: 'School Year',
        text: 'August 2022 - May 2023',
        color: theme.palette.mode === 'light' ? colors.richBlack[500] : colors.ghostWhite[400],
        action: () => {}
      },
      {
        icon: <WorkHistoryRoundedIcon sx={{ fontSize: { lg: 40, md: 40, sm: 30, xs: 30}}}/>,
        title: 'Request Time Off',
        text: '',
        color: theme.palette.mode === 'light' ? colors.richBlack[500] : colors.ghostWhite[400],
        action: () => {}
      },
      {
        icon: <EventRoundedIcon sx={{ fontSize: { lg: 40, md: 40, sm: 30, xs: 30}}}/>,
        title: 'Next Holiday',
        text: nextHoliday || '',
        color: theme.palette.mode === 'light' ? colors.richBlack[500] : colors.ghostWhite[400],
        action: () => {}
      }
    ] : user.role === 3 ? [
      {
        icon: <ListAltRoundedIcon sx={{ fontSize: { lg: 40, md: 40, sm: 30, xs: 30}}}/>,
        title: 'Joined Courses',
        text: userCourses.length,
        color: theme.palette.mode === 'light' ? colors.richBlack[500] : colors.ghostWhite[400],
        action: () => navigate('/Account', { state: { active: 'Courses' }})
      },
      {
        icon: <EventRoundedIcon sx={{ fontSize: { lg: 40, md: 40, sm: 30, xs: 30}}}/>,
        title: 'Next Holiday',
        text: nextHoliday || '',
        color: theme.palette.mode === 'light' ? colors.richBlack[500] : colors.ghostWhite[400],
        action: () => {}
      },
      {
        icon: <AttachMoneyRoundedIcon sx={{ fontSize: { lg: 40, md: 40, sm: 30, xs: 30}}}/>,
        title: 'Tuitions Cost',
        text: user && userCourses.length > 0 ? calculateStudentTuitions(userCourses.map(c => c.course_id), courses) : '$0',
        color: theme.palette.mode === 'light' ? colors.richBlack[500] : colors.ghostWhite[400],
        action: () => navigate('/Account/SchoolingFees')
      },
    ] : [])
  ]

  useEffect(() => {
    let insertLineData = [];
    setGrossIncome(0);

    if (students.length > 0 || teachers.length > 0) {
      var usersChartData = [...students,...teachers];
      usersChartData.forEach((user) => {
        var created_Date = new Date(user.created);
        var month = created_Date.toLocaleString('en-US', { month: 'long'});
        var data_validation = insertLineData.find(d => d.x === month);
        if (data_validation) {
          data_validation.y += 1;
        } else {
          insertLineData.push({x: month, y: 1});
        }
      });

      insertLineData.sort((a, b) => {
        const monthA = monthsMap[a.x];
        const monthB = monthsMap[b.x];
        
        return monthA - monthB;
      });

      setUserLineChart([
        {
          id: 'users',
          color: 'hsl(120, 70%, 50%)',
          data: insertLineData,
        }
      ])
    }

    if (userCourses.length > 0) {
      try {
        const groupedData = userCourses.reduce((acc, current) => {
          const course = courses.find(c => c._id === current.course_id);
          var course_price = course['Tuition Cost'].replace('$', '');
          course_price = parseInt(course_price.replace(',',''));
          setGrossIncome((prev) => prev += course_price)
          if (course) {
            const courseTitle = course['Course Title'];
            if (acc.hasOwnProperty(courseTitle)) {
              acc[courseTitle].value++;
            } else {
              acc[courseTitle] = {
                id: courseTitle,
                label: courseTitle,
                value: 1,
                color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
              };
            }
          }
          return acc;
        }, {});
  
        const resultArray = Object.values(groupedData);
  
        var fillData = resultArray.map(c => {
          return {
            match: {
              id: c.id
            },
            id: 'dots'
          }
        });
        setUserPieChart({ data: resultArray, fill: fillData}); 
      } catch (error) {
        console.log(error);
      }
    }

    getNextHoliday().then((res) => {
      setNextHoliday(res);
    }).catch((err) => console.error(err));
  }, [students, teachers, userCourses, courses, setNextHoliday]);  

  return (
    <Box flexGrow={1}>
      <InfoBlocks data={infoBlockData} />
      <Grid container spacing={2}>
        <Grid item lg={userPieChart.data.length > 0 ? 6 : 12} md={12} sm={12} xs={12}>
          { user.role === 1 && userLineChart.length > 0 && (
            <BlockContent className='dashboard-charts' sx={{backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : colors.richBlack[700]}}>
              <Typography variant='h5' fontWeight='bold'>Users that has joined</Typography>
              <LineChart data={userLineChart} />
            </BlockContent>
          )}
        </Grid>
        <Grid item lg={userLineChart.length > 0 ? 6 : 12} md={12} sm={12} xs={12}>
          { user.role === 1 && userPieChart.data.length > 0 && (
            <BlockContent className='dashboard-charts' sx={{backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : colors.richBlack[700]}}>
              <Typography variant='h5' fontWeight='bold'>Students in courses</Typography>
              <PieChart content={userPieChart} />
            </BlockContent>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard