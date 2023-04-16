import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/auth.context';
import './index.css';
import router from './router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
