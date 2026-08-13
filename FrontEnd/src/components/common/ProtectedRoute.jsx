import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if (user.role === 'seller') {
      return <Navigate to="/message" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if (user.role === 'seller') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export { ProtectedRoute, PublicRoute };