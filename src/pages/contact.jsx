import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./contactStyle.css";
import SideNav from "../components/sideNav";

const Contact = () => {
  const [isNavOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 justify-center items-center min-h-screen transition-margin duration-300 ${isNavOpen ? "ml-64" : ""
          }`}
      >
        {/* Burger Icon */}
        <button
          className={`absolute top-4 left-4 cursor-pointer font-bold ${isNavOpen ? "text-white" : "text-black"
            }`}
          onClick={toggleNav}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
      </div>

      <div className="container">
        <div className="text">Contact us</div>
        <form action="#">
          <div className="form-row">
            <div className="input-data">
              <input type="text" required />
              <div className="underline"></div>
              <label htmlFor="">First Name</label>
            </div>
            <div className="input-data">
              <input type="text" required />
              <div className="underline"></div>
              <label htmlFor="">Last Name</label>
            </div>
          </div>
          <div className="form-row">
            <div className="input-data">
              <input type="text" required />
              <div className="underline"></div>
              <label htmlFor="">Email Address</label>
            </div>
            <div className="input-data">
              <input type="text" required />
              <div className="underline"></div>
              <label htmlFor="">Subject</label>
            </div>
          </div>
          <div className="form-row">
            <div className="input-data textarea">
              <textarea rows="8" cols="80" required></textarea>
              <br />
              <div className="underline"></div>
              <label htmlFor="">Write your message</label>
            </div>
          </div>
          <center>
          <div className="form-row bg-[#517028] hover:bg-[#294a26] text-white w-52 rounded-md cursor-pointer">
            <div className="input-data">
              <div className="inner"></div>
              <input type="submit" value="Submit" />
            </div>
          </div>
          </center>
        </form>

      </div>
    </div>
  );
};

export default Contact;
