import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { ErrorPage } from './routes/ErrorPage';
import { Root } from './routes/Root';
import { Layout } from './routes/Layout';
import { Profile } from './routes/Profile';
import { List } from './routes/List';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Root />,
      },
      {
        path: '/list',
        element: <List />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
