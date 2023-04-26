import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';

interface Props {
  children: JSX.Element;
}

export const Protected = ({ children }: Props) => {
  const location = useLocation();
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};
