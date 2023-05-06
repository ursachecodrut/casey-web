import { createBrowserRouter } from 'react-router-dom';
import { Protected } from './components';
import { Root } from './layouts';
import {
  AddRecipePage,
  ErrorPage,
  LoginPage,
  ProfilePage,
  RecipePage,
  RecipesListPage,
  RegisterPage,
} from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Protected />,
        children: [
          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: '/add-recipe',
            element: <AddRecipePage />,
          },
        ],
      },
      {
        path: '/recipes',
        element: <RecipesListPage />,
      },
      {
        path: '/recipes/:id',
        element: <RecipePage />,
      },
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
