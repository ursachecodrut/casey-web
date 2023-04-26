import { Navigate, useLocation } from 'react-router-dom';
import { Container, Skeleton, Stack } from '@chakra-ui/react';
import { useAuth } from '../hooks';

interface Props {
  children: JSX.Element;
}

export const Protected = ({ children }: Props) => {
  const location = useLocation();
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Skeleton height="50px" />
        <Container>
          <Stack spacing={4} mt={10}>
            <Skeleton height="30px" />
            <Skeleton height="20px" />
            <Skeleton height="30px" />
            <Skeleton height="20px" />
          </Stack>

          <Stack spacing={6} mt={10} py={4}>
            <Skeleton height="30px" />
            <Skeleton height="20px" />
            <Skeleton height="30px" />
            <Skeleton height="20px" />
          </Stack>
        </Container>
      </>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};
