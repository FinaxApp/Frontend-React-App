import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

// Define the User type
interface User {
  dp: string;
  name: string;
  email: string;
}
  
  // Define the props interface for the DashBoard component
  interface DashBoardProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
  }
  
  

  export default function DashBoard({ user, setUser, setToken }: DashBoardProps) {
    const navigate = useNavigate();
    const setCookie = (name: string, value: string, days: number) => {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };
  
    const deleteCookie = (name: string) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    };
  
    const logout = () => {
      deleteCookie("token");
      setToken(null);
      setUser(null);
      navigate("/")
    };
  
    return (
      <div>
        <p>HI {user?.name}</p>
        <img
          src={user ? user.dp : "https://auth-db1131.hstgr.io/themes/pmahomme/img/logo_right.png"}
          alt="User Profile"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://auth-db1131.hstgr.io/themes/pmahomme/img/logo_right.png";
          }}
        />
        <button onClick={logout} className='bg-red-600 p-3 m-4 rounded-md text-white' type="button">Logout</button>
      </div>
    );
  }
