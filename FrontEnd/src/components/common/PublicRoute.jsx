import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // <--- This line is MANDATORY for /register to show up!
};

export default PublicRoute;