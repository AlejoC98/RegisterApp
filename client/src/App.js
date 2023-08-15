// import './App.css';
import { Route, Routes } from "react-router-dom";
import Login from "./views/auth/Login";
import './assets/styles/styles.scss';
import Register from "./views/auth/Register";
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./views/dashboard";
import { AppLayout, AuthLayout } from "./views/global/Layout";
import Account from "./views/account";
import Courses from "./views/courses";
import Students from "./views/students";
import Teachers from "./views/teachers";
import Admin from "./views/admin";
import Settings from "./views/settings";
import Create from "./views/forms/Form";
import ProtectedRoutes from "./ProtectedRoutes";
import { UserProvider } from "./context/UserContext";
import { GlobalProvider } from "./context/GlobalContext";
import Notification from "./views/notifications";
import CourseDetails from "./views/courses/CourseDetails";
import TeachersDetails from "./views/teachers/TeachersDetails";
import StudentDetails from "./views/students/StudentDetails";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider } from "@emotion/react";
import SchoolingFees from "./views/account/SchoolingFees";


function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <GlobalProvider>
            <Routes>
              <Route path="/" element={<ProtectedRoutes />}>
                <Route element={<AuthLayout />}>
                  <Route path="/Login" element={<Login />} />
                  <Route path="/Register" element={<Register />} />
                </Route>
                <Route element={<AppLayout/>}>
                  <Route path="/Dashboard" element={<Dashboard />} />
                  <Route path="/Courses" element={<Courses />} />
                  <Route path="/Courses/:id" element={<CourseDetails />} />
                  <Route path="/Students" element={<Students />} />
                  <Route path="/Students/:id" element={<StudentDetails />} />
                  <Route path="/Teachers" element={<Teachers />} />
                  <Route path="/Teachers/:id" element={<TeachersDetails />} />
                  <Route path="/Admin" element={<Admin />} />
                  <Route path="/Admin/:option" element={<Create />} />
                  <Route path="/Notifications" element={<Notification />} />
                  <Route path="/Notifications/:id" element={<Notification />} />
                  <Route path="/Settings" element={<Settings />} />
                  <Route path="/Account" element={<Account />} />
                  <Route path="/Account/SchoolingFees" element={<SchoolingFees />} />
                </Route>
              </Route>
            </Routes>
          </GlobalProvider>
        </UserProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
