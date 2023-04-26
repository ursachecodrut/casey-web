import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import './index.css';
import router from './router';
import { AuthProvider } from './context/auth.context';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </AuthProvider>
);
