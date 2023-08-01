import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { UserAuth } from './context/UserContext';

const ProtectedRoutes = () => {
    const { token } = UserAuth();
    const location = useLocation();
    
    switch (location.pathname) {
        case '/Login':
            return token ? <Navigate to='/Dashboard' /> : <Outlet />;
        case '/Register':
            return token ? <Navigate to='/Dashboard' /> : <Outlet />;
        default:
            return token ? <Outlet /> : <Navigate to='/Login' />;
    }
}

export default ProtectedRoutes;