import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [token, setToken] = useState(false);

    const fetchToken = () => {
        axios.get('/protected').then((res) => {
            setToken(res.data.status);
            setUser(res.data.user);
        }).catch((err) => {
            setToken(false);
        });
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

    return <UserContext.Provider value={{ user, setUserData, token, setUserToken }}>{children}</UserContext.Provider>;
}

export const UserAuth = () => {
    return useContext(UserContext);
}