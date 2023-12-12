// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars, faHippo, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import HomeCard from '../components/homeCard';
// import SideNav from '../components/sideNav';
// import Papa from 'papaparse';

// export default function Contact() {
// 	const [isNavOpen, setNavOpen] = useState(false);

// 	const toggleNav = () => {
// 		setNavOpen(!isNavOpen);
// 	};

// 	return (
// 		<div className="flex">
// 			{/* Side Navigation */}
// 			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

// 			{/* Main Content */}
// 			<div
// 				className={`flex flex-col flex-1 justify-center items-center min-h-screen transition-margin duration-300 ${isNavOpen ? 'ml-64' : ''}`}
// 			>
// 				{/* Burger Icon */}
// 				<button
// 					className={`absolute top-4 left-4 cursor-pointer font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
// 					onClick={toggleNav}
// 				>
// 					<FontAwesomeIcon icon={faBars} size="lg" />
// 				</button>

// 			</div>
// 		</div>
// 	);
// }

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import emailjs from '@emailjs/browser';
// import "./contactStyle.css";

// const ContactForm = () => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors }
//   } = useForm();
//   const [disabled, setDisabled] = useState(false);
//   const [alertInfo, setAlertInfo] = useState({
//     display: false,
//     message: '',
//     type: '',
//   });

//   // Shows alert message for form submission feedback
//   const toggleAlert = (message, type) => {
//     setAlertInfo({ display: true, message, type });

//     // Hide alert after 5 seconds
//     setTimeout(() => {
//       setAlertInfo({ display: false, message: '', type: '' });
//     }, 5000);
//   };

//   // Function called on submit that uses emailjs to send email of valid contact form
//   const onSubmit = async (data) => {
//     // Destrcture data object
//     const { name, email, subject, message } = data;
//     try {
//       // Disable form while processing submission
//       setDisabled(true);

//       const templateParams = {
//         name,
//         email,
//         subject,
//         message
//       };

//       await emailjs.send(
//         process.env.REACT_APP_SERVICE_ID,
//         process.env.REACT_APP_TEMPLATE_ID,
//         templateParams,
//         process.env.REACT_APP_USER_ID
//       );

//      // Display success alert
//     toggleAlert('Form submission was successful!', 'success');
//     } catch (e) {
//       console.error(e);
//       // Display error alert
//       toggleAlert('Uh oh. Something went wrong.', 'danger');
//     } finally {
//       // Re-enable form submission
//       setDisabled(false);
//       // Reset contact form fields after submission
//       reset();
//     }
//   };

//   return (
//     <div className='ContactForm'>
//       <div className='container'>
//         <div className='row'>
//           <div className='col-12 text-center'>
//             <div className='contactForm'>
//               <form id='contact-form' onSubmit={handleSubmit(onSubmit)} noValidate>
//                 {/* Row 1 of form */}
//                 <div className='row formRow'>
//                   <div className='col-6'>
//                     <input
//                       type='text'
//                       name='name'
//                       {...register('name', {
//                         required: { value: true, message: 'Please enter your name' },
//                         maxLength: {
//                           value: 30,
//                           message: 'Please use 30 characters or less'
//                         }
//                       })}
//                       className='form-control formInput'
//                       placeholder='Name'
//                     ></input>
//                     {errors.name && <span className='errorMessage'>{errors.name.message}</span>}
//                   </div>
//                   <div className='col-6'>
//                     <input
//                       type='email'
//                       name='email'
//                       {...register('email', {
//                         required: true,
//                         pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
//                       })}
//                       className='form-control formInput'
//                       placeholder='Email address'
//                     ></input>
//                     {errors.email && (
//                       <span className='errorMessage'>Please enter a valid email address</span>
//                     )}
//                   </div>
//                 </div>
//                 {/* Row 2 of form */}
//                 <div className='row formRow'>
//                   <div className='col'>
//                     <input
//                       type='text'
//                       name='subject'
//                       {...register('subject', {
//                         required: { value: true, message: 'Please enter a subject' },
//                         maxLength: {
//                           value: 75,
//                           message: 'Subject cannot exceed 75 characters'
//                         }
//                       })}
//                       className='form-control formInput'
//                       placeholder='Subject'
//                     ></input>
//                     {errors.subject && (
//                       <span className='errorMessage'>{errors.subject.message}</span>
//                     )}
//                   </div>
//                 </div>
//                 {/* Row 3 of form */}
//                 <div className='row formRow'>
//                   <div className='col'>
//                     <textarea
//                       rows={3}
//                       name='message'
//                       {...register('message', {
//                         required: true
//                       })}
//                       className='form-control formInput'
//                       placeholder='Message'
//                     ></textarea>
//                     {errors.message && <span className='errorMessage'>Please enter a message</span>}
//                   </div>
//                 </div>
//                 <button className='submit-btn' type='submit'>
//                   Submit
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//         {alertInfo.display && (
//           <div
//             className={`alert alert-${alertInfo.type} alert-dismissible mt-5`}
//             role='alert'
//           >
//             {alertInfo.message}
//             <button
//               type='button'
//               className='btn-close'
//               data-bs-dismiss='alert'
//               aria-label='Close'
//               onClick={() =>
//                 setAlertInfo({ display: false, message: '', type: '' })
//               } // Clear the alert when close button is clicked
//             ></button>
//           </div>
//         )}
//     </div>
//   );
// };

// export default ContactForm;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHippo,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import "./contactStyle.css";
import SideNav from "../components/sideNav";

const contact = () => {
  const [isNavOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };
  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 justify-center items-center min-h-screen transition-margin duration-300 ${
          isNavOpen ? "ml-64" : ""
        }`}
      >
        {/* Burger Icon */}
        <button
          className={`absolute top-4 left-4 cursor-pointer font-bold ${
            isNavOpen ? "text-white" : "text-black"
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
          <div className="form-row submit-btn">
            <div className="input-data">
              <div className="inner"></div>
              <input type="submit" value="submit" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default contact;
