import { Navigate, Outlet } from 'react-router-dom';
import { getLoggedInUser } from '../utils/auth';

const ProtectedRoute = ({ allowedRoles }) => {
    // 1. Buscamos el token y el usuario en el almacenamiento del navegador
    const token = localStorage.getItem('token');
    const user = getLoggedInUser();

    // 2. Si no hay token o no hay usuario, lo pateamos al Login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si la ruta exige ciertos roles, verificamos si el usuario tiene permiso
    // (Si allowedRoles no se envía, significa que cualquier usuario logueado puede entrar)
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        alert("⛔ No tienes permisos para acceder a esta sección.");
        return <Navigate to="/" replace />;
    }

    // 4. Si todo está bien, lo dejamos pasar a la ruta que pidió (<Outlet />)
    return <Outlet />;
};

export default ProtectedRoute;