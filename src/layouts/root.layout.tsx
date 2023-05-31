import { Outlet } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import { Navbar } from '../components';

export const Root = () => {
  return (
    <>
      <Navbar />
      <Box py="6">
        <Outlet />
      </Box>
    </>
  );
};
