import { Outlet } from 'react-router-dom';
import { Navbar } from '../components';

export const Root = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};
