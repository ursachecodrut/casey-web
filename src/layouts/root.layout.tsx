import { Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components';

export const Root = () => {
  return (
    <div>
      <Navbar />
      <Container>
        <Outlet />
      </Container>
    </div>
  );
};
