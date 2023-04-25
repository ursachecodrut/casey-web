import { Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components';

export const Root = () => {
  return (
    <>
      <Navbar />
      <Container>
        <Outlet />
      </Container>
    </>
  );
};
