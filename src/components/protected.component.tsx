import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  children: JSX.Element;
}

export const Protected = ({ children }: Props) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};
