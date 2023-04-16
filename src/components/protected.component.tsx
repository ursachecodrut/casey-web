import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';

interface Props {
  children: JSX.Element;
}

export const Protected = ({ children }: Props) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};
