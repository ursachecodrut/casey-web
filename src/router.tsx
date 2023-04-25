import { createBrowserRouter } from 'react-router-dom';
import { Protected } from './components';
import { Root } from './layouts';
import { ErrorPage, LoginPage, ProfilePage, RegisterPage } from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Protected>
        <Root />
      </Protected>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
]);

export default router;
