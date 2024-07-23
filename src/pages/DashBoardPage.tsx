import React from 'react';
import DashBoard from '../components/DashBoard';

// Define the User type and props interface
interface User {
  dp: string;
  name: string;
  email: string;
}
interface DashBoardPageProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}



// Use the props interface in the component
export default function DashBoardPage({ user, setUser, setToken }: DashBoardPageProps) {
  return (
    <DashBoard user={user} setUser={setUser} setToken={setToken} />
  );
}
