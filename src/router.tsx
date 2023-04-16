import { createBrowserRouter } from 'react-router-dom';
import { Protected } from './components';
import { Root } from './layouts';
import { ErrorPage, LoginPage, RegisterPage } from './pages';
import { ProfilePage } from './pages/profile.page';

const router = createBrowserRouter([
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
      {
        path: '/profile',
        element: (
          <Protected>
            <ProfilePage />
          </Protected>
        ),
      },
    ],
  },
]);

export default router;
