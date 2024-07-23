import React, { useEffect, useState, useCallback } from 'react';
import SignInPage from './pages/SignInPage';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import DashBoardPage from './pages/DashBoardPage';
import SignUpPage from './pages/SignUpPage';

const REACT_APP_BASE_API_URL = "http://finax.up.railway.app";

interface User {
  dp: string;
  name: string;
  email: string;
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

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = useCallback(async () => {
    const token = getCookie("token");
    if (token) {
      try {
        const response = await axios.get(`${REACT_APP_BASE_API_URL}/api/user`, {
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
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      setCookie("token", token, 1);
      setToken(token);
      fetchUserData(); // Fetch user data when token is set
    }
  }, [fetchUserData]);

  useEffect(() => {
    if (token) {
      fetchUserData(); // Fetch user data when token changes
    }
  }, [token, fetchUserData]);

  return (
    <Routes>
      <Route path="/" element={!token ? <SignInPage /> : <DashBoardPage user={user} setUser={setUser} setToken={setToken} />} />
      <Route path="/signup" element={!token ? <SignUpPage /> : <DashBoardPage user={user} setUser={setUser} setToken={setToken} />} />
    </Routes>
  );
}

export default App;
