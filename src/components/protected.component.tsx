import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks';

export const Protected = () => {
  const location = useLocation();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    // console.log(loading);
  }, [loading]);

  useEffect(() => {
    // console.log(currentUser);
  }, [currentUser]);

  if (loading) {
    return <div>loading</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
};
