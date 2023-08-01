import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [userCourses, setUserCourses] = useState([]);
    const [token, setToken] = useState(false);

    const fetchToken = () => {
        axios.get('/protected').then((res) => {
            setToken(res.data.status);
            setUser(res.data.user);
        }).catch((err) => {
            setToken(false);
        });
    }

    const getUserCourses = useCallback(() => {
        axios.post('/getData', {
            collection: 'usercourses',
            filter: { user_id: user._id }
        }).then((res) => {
            if (res.data) {
                setUserCourses(res.data);
            }
        }).catch((err) => toast.error(err));
    }, [user]);

    const setUserCoursesData = (data) => {
        setUserCourses(data);
    }

    const setUserToken = (status) => {
        setToken(status);
    }

    const setUserData = (userData) => {
        setUser(userData);
    }

    useEffect(() => {
        fetchToken();
    },[]);

    useEffect(() => {
        getUserCourses();
    }, [user, getUserCourses]);

    return <UserContext.Provider value={{ user, userCourses, setUserData, setUserCoursesData, token, setUserToken }}>{children}</UserContext.Provider>;
}

export const UserAuth = () => {
    return useContext(UserContext);
}