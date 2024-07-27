import axios from 'axios';
import React, { useState } from 'react';
import { env } from '../utils/env.config';

interface User {
  dp: string;
  name: string;
  email: string;
}


interface DashBoardProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function DashBoard({ user, setUser, setToken }: DashBoardProps) {
  // const REACT_APP_BASE_API_URL = "http://finax.up.railway.app";
  // const REACT_APP_BASE_API_URL = "http://localhost:8080";

  const [isFormVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    GSTNumber: "",
    PANNumber: "",
    TDSNumber: "",
    phone: "",
    email: "",
  });
  


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
        const response = await axios.post(
          `${env.BASE_API_URL}/api/company`,
          formData,
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCompany();
    setFormVisible(false);
  };

  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow p-8 bg-gray-100">
        <button 
          type='button' 
          onClick={toggleFormVisibility} 
          className='bg-blue-600 p-3 m-4 rounded-md text-white'
        >
          Create Company
        </button>
        {isFormVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
                onClick={toggleFormVisibility}
              >
                &times;
              </button>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="address" className="block text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gstNumber" className="block text-gray-700 mb-2">GST Number</label>
                      <input
                        type="text"
                        id="gstNumber"
                        value={formData.GSTNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="panNumber" className="block text-gray-700 mb-2">PAN Number</label>
                      <input
                        type="text"
                        id="panNumber"
                        value={formData.PANNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="tdsNumber" className="block text-gray-700 mb-2">TDS Number</label>
                      <input
                        type="text"
                        id="tdsNumber"
                        value={formData.TDSNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Create Company
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
