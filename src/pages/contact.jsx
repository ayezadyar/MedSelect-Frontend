// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faBars,
//   faHippo,
//   faMagnifyingGlass,
// } from "@fortawesome/free-solid-svg-icons";
// import "./contactStyle.css";
// import SideNav from "../components/sideNav";

// const contact = () => {
//   const [isNavOpen, setNavOpen] = useState(false);

//   const toggleNav = () => {
//     setNavOpen(!isNavOpen);
//   };
//   return (
//     <div className="flex">
//       {/* Side Navigation */}
//       <SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

//       {/* Main Content */}
//       <div
//         className={`flex flex-col flex-1 justify-center items-center min-h-screen transition-margin duration-300 ${
//           isNavOpen ? "ml-64" : ""
//         }`}
//       >
//         {/* Burger Icon */}
//         <button
//           className={`absolute top-4 left-4 cursor-pointer font-bold ${
//             isNavOpen ? "text-white" : "text-black"
//           }`}
//           onClick={toggleNav}
//         >
//           <FontAwesomeIcon icon={faBars} size="lg" />
//         </button>
//       </div>

//       <div className="container">
//         <div className="text">Contact us</div>
//         <form action="#">
//           <div className="form-row">
//             <div className="input-data">
//               <input type="text" required />
//               <div className="underline"></div>
//               <label htmlFor="">First Name</label>
//             </div>
//             <div className="input-data">
//               <input type="text" required />
//               <div className="underline"></div>
//               <label htmlFor="">Last Name</label>
//             </div>
//           </div>
//           <div className="form-row">
//             <div className="input-data">
//               <input type="text" required />
//               <div className="underline"></div>
//               <label htmlFor="">Email Address</label>
//             </div>
//             <div className="input-data">
//               <input type="text" required />
//               <div className="underline"></div>
//               <label htmlFor="">Subject</label>
//             </div>
//           </div>
//           <div className="form-row">
//             <div className="input-data textarea">
//               <textarea rows="8" cols="80" required></textarea>
//               <br />
//               <div className="underline"></div>
//               <label htmlFor="">Write your message</label>
//             </div>
//           </div>
//           <div className="form-row submit-btn">
//             <div className="input-data">
//               <div className="inner"></div>
//               <input type="submit" value="submit" />
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default contact;

import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./contactStyle.css";
import SideNav from "../components/sideNav";

const contact = () => {
  const [isNavOpen, setNavOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    subject: "",
    message: "",
  });
  const firebaseConfig = {
    apiKey: "AIzaSyAvMA1Wryh0Sbq3T6SlMlpfHinwFzBl-BA",
    authDomain: "medselect-e1aec.firebaseapp.com",
    projectId: "medselect-e1aec",
    storageBucket: "medselect-e1aec.appspot.com",
    messagingSenderId: "271973218747",
    appId: "1:271973218747:web:48fb260edbf68285a9ac9e",
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Initialize Firebase

    try {
      // Add form data to Realtime Database
      const dbRef = ref(db, "contacts");
      const newContactRef = ref(
        db,
        `contacts/${formData.firstName}-${formData.lastName}`
      );
      await set(newContactRef, formData);

      console.log("Document written with ID: ", newContactRef.key);

      // Reset form after submission
      setFormData({
        firstName: "",
        lastName: "",
        emailAddress: "",
        subject: "",
        message: "",
      });
      alert("Contact Info stored successfully!");
    } 
    catch (e) {
      console.error("Error adding document: ", e);
      alert("Error storing data. Please try again.");
    }
  };

  return (
    <div className="flex">
      <SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 justify-center items-center min-h-screen transition-margin duration-300 ${
          isNavOpen ? "ml-64" : ""
        }`}
      >
        <button
          className={`absolute top-4 left-4 cursor-pointer font-bold ${
            isNavOpen ? "text-white" : "text-black"
          }`}
          onClick={toggleNav}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        {/* Your Form */}
        <div className="container">
          <div className="text">Contact us</div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-data">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <div className="underline"></div>
                <label htmlFor="">First Name</label>
              </div>
              <div className="input-data">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <div className="underline"></div>
                <label htmlFor="">Last Name</label>
              </div>
            </div>
            <div className="form-row">
              <div className="input-data">
                <input
                  type="text"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  required
                />
                <div className="underline"></div>
                <label htmlFor="">Email Address</label>
              </div>
              <div className="input-data">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                <div className="underline"></div>
                <label htmlFor="">Subject</label>
              </div>
            </div>
            <div className="form-row">
              <div className="input-data textarea">
                <textarea
                  rows="8"
                  cols="80"
                  name="message" // Add this line
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <br />
                <div className="underline"></div>
                <label htmlFor="message">Write your message</label>
              </div>
            </div>
            {/* Submit Button */}
            <div className="form-row submit-btn">
              <div className="input-data">
                <div className="inner"></div>
                <input type="submit" value="Submit" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default contact;
