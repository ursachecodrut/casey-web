import { useAuth } from '../hooks';

export const ProfilePage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <h1>Not logged in</h1>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <h1>Welcome {currentUser.email}</h1>
    </div>
  );
};
