import React from 'react';
import { Link } from 'react-router-dom';

interface User {
  dp: string;
  name: string;
  email: string;
}

interface NavbarProps {
  user: User | null;
  logout: () => void;
}

const Navbar = ({ user, logout }: NavbarProps) => {
  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className='flex items-center space-x-10'>
          <Link to="/" className="text-gray-800 text-lg font-bold"><img className="mx-auto w-24" src="assets/images/finax2.png" alt="Your Company" /></Link>
          <Link to="/privacy-policy" className="text-gray-800 text-left">Privacy Policy</Link>
        </div>
        <div className="flex items-center">
          {user ? (
            <div className="text-gray-800 mr-4 flex items-center">
              <span>{user.name}</span>
              <img src={user.dp} alt="User Profile" className="inline-block w-8 h-8 rounded-full ml-2 border border-gray-300" />
            </div>
          ) : (
            <span className="text-gray-800 mr-4">Guest</span>
          )}
          <button onClick={logout} className="hover:bg-black p-2 rounded-md hover:text-white border-black border"><span className="mr-2 ml-1">Logout</span><i className="fa fa-sign-out ml-2"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
