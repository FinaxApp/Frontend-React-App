import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { env } from '../utils/env.config';

interface User {
  dp: string;
  name: string;
  email: string;
}

interface Company {
  id: string;
  name: string;
  address: string;
  GSTNumber: string;
  PANNumber: string;
  TDSNumber: string;
  phone: string;
  email: string;
}

interface DashBoardProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function DashBoard({ user, setUser, setToken }: DashBoardProps) {
  const [isFormVisible, setFormVisible] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    gstNumber: "",
    panNumber: "",
    tdsNumber: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

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

  const fetchCompanies = async () => {
    const token = getCookie("token");
    if (token) {
      try {
        const response = await axios.get(`${env.BASE_API_URL}/company`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(response.data.companies);
      } catch (error: any) {
        console.error("Error fetching companies:", error);
        // Handle errors as needed, possibly displaying them to the user
      }
    }
  };

  const createCompany = async () => {
    const token = getCookie("token");
    if (token) {
      try {
        const requestBody = {
          name: formData.name.trim(),
          address: formData.address.trim(),
          GSTNumber: formData.gstNumber.trim(),
          PANNumber: formData.panNumber.trim(),
          TDSNumber: formData.tdsNumber.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
        }
        const response = await axios.post(
          `${env.BASE_API_URL}/company`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("company:", response.data);
        setCompanies([...companies, response.data]); // Add the new company to the list
        setFormData({
          name: "",
          address: "",
          gstNumber: "",
          panNumber: "",
          tdsNumber: "",
          phone: "",
          email: "",
        });
        setFormVisible(false); // Close form after successful creation
      } catch (error: any) {
        console.error("Error creating company:", error);
        // Handle errors as needed, possibly displaying them to the user
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
                        value={formData.gstNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="panNumber" className="block text-gray-700 mb-2">PAN Number</label>
                      <input
                        type="text"
                        id="panNumber"
                        value={formData.panNumber}
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
                        value={formData.tdsNumber}
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
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Companies</h2>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {companies.map(company => (
              <div key={company.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold">{company.name}</h3>
                <p><strong>Address:</strong> {company.address}</p>
                <p><strong>GST Number:</strong> {company.GSTNumber}</p>
                <p><strong>PAN Number:</strong> {company.PANNumber}</p>
                <p><strong>TDS Number:</strong> {company.TDSNumber}</p>
                <p><strong>Phone:</strong> {company.phone}</p>
                <p><strong>Email:</strong> {company.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
