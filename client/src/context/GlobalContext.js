import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { UserAuth } from './UserContext';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const { user } = UserAuth();

    const [roles, setRoles] = useState([]);
    const [menus, setMenus] = useState([]);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const requireData = useMemo(() => [
        {
            collection: 'roles',
            filter: {}
        },
        {
            collection: 'menus',
            filter: { role: user || 3}
        },
        {
            collection: 'courses',
            filter: {}
        },
        {
            collection: 'notifications',
            filter: user.role === 1 ? { role: user.role, status: 'Pending' } : { $or:   [
                { role: user.role },
                { user_id: user._id }
              ]
            }
        },
        {
            collection: 'users',
            filter: { role: 2 }
        },
        {
            collection: 'users',
            filter: { role: 3 }
        },
    ], [user]);

    // Update List Function
    const updateList = (list, newItem) => {
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
    }

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
        }

        try {
        const eventSource = new EventSource('http://localhost:4000/notification');

            eventSource.onmessage = (event) => {
                if (event.data !== 'undefined') {
                    const newNoti = JSON.parse(event.data);
                    if (newNoti.role === user.role || newNoti.user_id === user._id) {
                        setNotifications((prev) => [...prev, newNoti]);
                    }
                } else {
                    setNotifications([]);
                }
            }
            
            return () => {
                eventSource.close();
            }
        } catch (error) {
            console.log(error);
        }

    }, [user, getData]);

    return <GlobalContext.Provider value={{ roles, menus, notifications, courses, teachers, students, updateList, getData }}>{children}</GlobalContext.Provider>;    

}

export const Global = () => {
    return useContext(GlobalContext);
}