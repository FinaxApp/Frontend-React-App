import axios from 'axios';
import React from 'react'
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
  const REACT_APP_BASE_API_URL = "http://finax.up.railway.app";
  // const REACT_APP_BASE_API_URL = "http://localhost:8080";

  const navigate = useNavigate();

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  };

  const logout = () => {
    deleteCookie("token");
    setToken(null);
    setUser(null);
    navigate("/")
  };

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const part = parts.pop();
      if (part) {
        return part.split(';').shift() ?? null;
      }
    }
    return null;
  };

  const createCompany = async () => {
    const token = getCookie("token");
    if (token) {
      try {
        console.log(token)
        const response = await axios.post(
          `${REACT_APP_BASE_API_URL}/api/company`,
          {
            name: "vijay sales",
            address: "surat guj",
            GSTNumber: "37793196389q1",
            PANNumber: "3q8 ryn3q89wry3qnd98q3y",
            TDSNumber: "dmo3w89fjnweouifh",
            phone: "939031975091",
            email: "wegvoilwm",
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        
        console.log("company:", response.data);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          // localStorage.removeItem("token");
          // setToken(null);
        }
      }
    }
  }

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
      <button type='button' onClick={createCompany} className='bg-blue-600 p-3 m-4 rounded-md text-white'>create company</button>
    </div>
  );
}
