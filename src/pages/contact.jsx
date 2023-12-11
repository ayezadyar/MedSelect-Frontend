import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import SideNav from '../components/sideNav';

export default function Contact() {
  const [isNavOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your contact form submission logic here
  };

  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 justify-center items-center min-h-screen transition-margin duration-300 ${isNavOpen ? 'ml-64' : ''}`}
      >
        {/* Burger Icon */}
        <button
          className={`absolute top-4 left-4 cursor-pointer font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
          onClick={toggleNav}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        {/* Contact Form */}
        <div className="text-center mt-8 p-8 bg-green-700 shadow-md rounded-md">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <label className="mt-2">
              Name:
              <input type="text" name="name" className="mt-1 p-2 bg-gray-200 text-gray-800 rounded-md" />
            </label>
            <label className="mt-2">
              Email:
              <input type="email" name="email" className="mt-1 p-2 bg-gray-200 text-gray-800 rounded-md" />
            </label>
            <label className="mt-2">
              Message:
              <textarea name="message" rows="4" className="mt-1 p-2 bg-gray-200 text-gray-800 rounded-md" />
            </label>
            <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              Submit
            </button>
          </form>
        </div>

        {/* Company Information */}
        <div className="text-center mt-8 p-8 bg-green-700 shadow-md rounded-md">
          <h3 className="text-2xl font-bold mb-2">Company Information</h3>
          <p className="text-gray-200">Phone: (123) 456-7890</p>
          <p className="text-gray-200">Address: 123 Main Street, City, Country</p>
          <p className="text-gray-200">Email: info@example.com</p>
        </div>

        {/* Link to Home Page */}
        <Link to="/" className="text-blue-500 hover:underline mt-4">
          Back to Home
        </Link>
      </div>
    </div>
  );
}







