import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import PrivacyPage from './pages/PrivacyPage';
import DashBoardPage from './pages/DashBoardPage';
import Navbar from './components/NavBarComponent';
import { env } from './utils/env.config';

// const REACT_APP_BASE_API_URL = "http://finax.up.railway.app";

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

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  };

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    const token = getCookie("token");
    if (token) {
      try {
        const response = await axios.get(`${env.BASE_API_URL}/api/user`, {
          headers: {
            Authorization: token,
          },
        });
        setUser(response.data.user);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          deleteCookie("token");
          setToken(null);
        }
      }
    }
    setIsLoading(false); // Set loading to false after fetching data
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const tokenFromCookie = getCookie('token');

    if (token) {
      setCookie("token", token, 1);
      setToken(token);
      fetchUserData();
    } else if (tokenFromCookie) {
      setToken(tokenFromCookie);
      fetchUserData();
    } else {
      setIsLoading(false); // If no token, stop loading
    }
  }, [fetchUserData]);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token, fetchUserData]);

  const logout = () => {
    deleteCookie("token");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching data
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          !token ? (
            <Navigate to="/signup" />
          ) : (
            <>
              <Navbar user={user} logout={logout} />
              <DashBoardPage user={user} setUser={setUser} setToken={setToken} />
            </>
          )
        }
      />
      <Route path="/signup" element={!token ? <SignUpPage /> : <Navigate to="/" />} />
      <Route path="/signin" element={!token ? <SignInPage /> : <Navigate to="/" />} />
      <Route
        path="/privacy-policy"
        element={
          !token ? (
            <Navigate to="/signup" />
          ) : (
            <>
              <Navbar user={user} logout={logout} />
              <PrivacyPage />
            </>
          )
        }
      />
    </Routes>
  );
}

export default App;
