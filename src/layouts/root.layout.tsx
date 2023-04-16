import { Container } from '@mui/material';
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
