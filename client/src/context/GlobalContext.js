import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { UserAuth } from './UserContext';
import io from 'socket.io-client';
export const socket = io.connect('http://localhost:4000');

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const { user } = UserAuth();

    const [roles, setRoles] = useState([]);
    const [menus, setMenus] = useState([]);
    const [courses, setCourses] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const requireData = useMemo(() => [
        {
            collection: 'roles',
            filter: {}
        },
        ...(user && [{
            collection: 'menus',
            filter: { role: user.role}
        }]),
        {
            collection: 'courses',
            filter: {}
        },
        ...(user && [{
            collection: 'notifications',
            filter: user.role === 1 ? { role: user.role} : { $or:   [
                { role: user.role},
                { user_id: user._id}
              ]
            }
        }]),
        {
            collection: 'users',
            filter: { role: 2 }
        },
        {
            collection: 'users',
            filter: { role: 3 }
        },
        {
            collection: 'usercourses',
            filter: user.role === 1 ? {} : { user_id: user._id}
        }
    ], [user]);

    // Update List Function
    const updateList = useCallback((list, newItem) => {
        switch (list) {
            case 'roles':
                setRoles((prev) => [...prev, newItem]);
                break;
            case 'menus':
                setMenus((prev) => [...prev, newItem]);
                break;
            case 'courses':
                setCourses((prev) => [...prev, newItem]);
                break;
            case 'usercourses':
                setUserCourses((prev) => [...prev, newItem]);
                break;
            case 'notifications':
                setNotifications((prev) => [...prev, newItem]);
                break;
            case 'students':
                setStudents((prev) => [...prev, newItem]);
                break;
            case 'teachers':
                setTeachers((prev) => [...prev, newItem]);
                break;
            default:
                toast.warning('List not found');
                break;
        }  
    }, [setRoles, setMenus, setCourses, setUserCourses, setNotifications, setStudents, setTeachers]);
    // Get data function
    const getData = useCallback(() => {
        requireData.forEach((c) => {
            axios.post('/getData', c).then((res) => {
                switch (c.collection) {
                    case 'roles':
                        setRoles(res.data);
                        break;
                    case 'menus':
                        setMenus(res.data);
                        break;
                    case 'courses':
                        setCourses(res.data);
                        break;
                    case 'usercourses':
                        setUserCourses(res.data);
                        break;
                    case 'notifications':
                        setNotifications(res.data);
                        break;
                    case 'users':
                        switch (c.filter.role) {
                            case 2:
                                setTeachers(res.data);
                                break;
                            case 3:
                                setStudents(res.data);
                                break;
                            default:
                                console.log('Role not found');
                                break;
                        }
                        break;
                    default:
                        toast.error('List not found!');
                        break;
                }
            }).catch((err) => toast.error(err));
        });
    }, [requireData, setRoles, setMenus, setCourses, setTeachers, setStudents]);

    useEffect(() => {
        if (user !== undefined && Object.keys(user).length > 0) {
            getData();
            
            socket.emit('newUser', user);

            socket.on('getNotification', data => {
                try {
                    if (data.user_id === '') {
                        if (user.role === data.role) {
                            updateList('notifications', data);
                        }
                    } else {
                        if (user._id === data.user_id) {
                            updateList('notifications', data);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        }
    }, [user, getData, updateList]);

    return <GlobalContext.Provider value={{ roles, menus, notifications, courses, setCourses, userCourses, teachers, students, updateList, getData }}>{children}</GlobalContext.Provider>;    

}

export const Global = () => {
    return useContext(GlobalContext);
}