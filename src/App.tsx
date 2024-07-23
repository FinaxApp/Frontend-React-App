import React, { useEffect, useState } from 'react';
import SignInPage from './pages/SignInPage';
import axios from 'axios';

interface User {
  dp: string;
  name:String;
  email:String;
}

function App() {
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

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = async () => {
    const token = getCookie("token");
    if (token) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/user`, {
          headers: {
            Authorization: token,
          },
        });
        console.log("User data fetched:", response.data);
        setUser(response.data.user);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setToken(null);  // Optionally clear the token state
        }
      }
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      setCookie("token", token, 1);
      setToken(token);
      fetchUserData(); // Fetch user data when token is set
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserData(); // Fetch user data when token changes
    }
  }, [token]);

  const logout = ()=>{
    deleteCookie("token")
    setToken("")
  }

  return (
    <div>
      {!token ? (
        <SignInPage />
      ) : (
        <div>
          <p>HI  {user?.name}</p>
          <img
            src={user ? user.dp : "https://auth-db1131.hstgr.io/themes/pmahomme/img/logo_right.png"}
            alt="User Profile"
            onError={(e) => {
              // Handle image load error
              (e.target as HTMLImageElement).src = "https://auth-db1131.hstgr.io/themes/pmahomme/img/logo_right.png";
            }}
          />
          <button onClick={logout} className='bg-red-600 p-3 m-4 rounded-md text-white' type="button">Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
