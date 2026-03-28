// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is approved (admins always approved)
  if (!user.approved && user.role !== 'admin') {
    return <Navigate to="/pending" replace />;
  }

  return children;
};