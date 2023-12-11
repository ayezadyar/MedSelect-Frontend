import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import SideNav from '../components/sideNav';

export default function About() {
  const [isNavOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Side Navigation */}
      <SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 justify-center items-center transition-margin duration-300 ${isNavOpen ? 'ml-64' : ''}`}
      >
        {/* Burger Icon */}
        <button
          className={`absolute top-4 left-4 cursor-pointer font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
          onClick={toggleNav}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        {/* Logo */}
        <img
          src="/images/logo.png"
          alt=""
          className="mb-4"
          style={{ width: '200px', height: '200px', borderRadius: '50%' }}
        />

        {/* About Us Content */}
        <div className="text-center mt-8 p-8 bg-green-700 shadow-md rounded-md">
          <h2 className="text-3xl font-bold mb-4 text-white">About Us</h2>
          <p className="text-white">
            Welcome to Medselect – your go-to platform for indispensable medication insights! We are your trusted ally in healthcare decision-making, offering a suite of services to empower your journey to wellness.
            Discover Informative Insights to make informed choices about alternative medicines.
            Experience Effortless Locating, swiftly identifying nearby pharmacies for seamless procurement.
            Engage in Expert Consultations with verified specialists for personalized guidance.
            Join our Vibrant Community forum to share experiences and discuss the pros and cons of medications.
          </p>
          <p className="text-white mt-2">
            Learn more about our mission and values, and discover the talented individuals who make up our team.
          </p>
        </div>

        {/* Link to Home Page */}
        <Link to="/" className="text-blue-500 hover:underline mt-4">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
