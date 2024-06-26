import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { db, auth } from "../../Firebase"; // Adjust import paths as necessary
import SideNav from "../sideNav";
import {
   collection,
   addDoc,
   doc,
   updateDoc,
   GeoPoint,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const RequestGenerate = () => {
   const [isNavOpen, setNavOpen] = useState(false);
   const [medicineName, setMedicineName] = useState("");
   const [longitude, setLongitude] = useState("");
   const [latitude, setLatitude] = useState("");

   const navigate = useNavigate();

   useEffect(() => {
      navigator.geolocation.getCurrentPosition(
         position => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
         },
         () => {
            toast.error("Location access denied", {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "colored",
            });
         }
      );
   }, []);

   const toggleNav = () => setNavOpen(!isNavOpen);

   const handleSubmit = async (event) => {
      event.preventDefault();
      const user = auth.currentUser;
      if (!user) {
         console.log("No user signed in");
         return;
      }

      try {
         await addDoc(collection(db, "medRequest"), {
            generatorUserId: user.uid,
            medicineName,
            location: new GeoPoint(parseFloat(latitude), parseFloat(longitude)),
            isCurrentlyActive: true,
         });

         await updateDoc(doc(db, "users", user.uid), {
            isMedRequest: true,
         });

         console.log("Medicine request added successfully");
         setMedicineName("");
         setLongitude("");
         setLatitude("");
         toast.info("Medicine request generated", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
         });
         setTimeout(() => navigate("/"), 5000);
      } catch (error) {
         console.error("Error adding medicine request: ", error);
      }
   };

   return (
      <div className="flex overflow-hidden">
         <style>
            {`
                    input[type='number']::-webkit-inner-spin-button,
                    input[type='number']::-webkit-outer-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }

                    input[type='number'] {
                        -moz-appearance: textfield; /* Firefox */
                    }
                `}
         </style>

         <SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
         <div
            className={`flex flex-col justify-center items-center min-h-screen transition-margin duration-300 w-full ${isNavOpen ? "ml-64" : "ml-0"
               }`}
         >
            <button
               className={`absolute top-4 left-4 z-20 cursor-pointer font-bold ${isNavOpen ? "text-white" : "text-black"
                  }`}
               onClick={toggleNav}
            >
               <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
            <div className="max-w-lg w-full px-4" style={{ zIndex: 10 }}>
               <form
                  onSubmit={handleSubmit}
                  className="mt-10 bg-white p-6 rounded-lg shadow"
               >
                  <div className="mb-4">
                     <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="medicineName"
                     >
                        Medicine Name:
                     </label>
                     <input
                        type="text"
                        value={medicineName}
                        onChange={(e) => setMedicineName(e.target.value)}
                        required
                        className="appearance-none border-b border-gray-300 w-full py-2 leading-tight focus:outline-none focus:ring-0 focus:border-[#294a26]"
                        id="medicineName"
                        style={{ transition: "border-color 0.3s" }}
                     />
                  </div>
                  <div className="mb-4">
                     <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="latitude"
                     >
                        Latitude:
                     </label>
                     <input
                        type="number"
                        step="any"
                        value={latitude}
                        readOnly // Users should not manually change the coordinate
                        className="appearance-none border-b border-gray-300 w-full py-2 leading-tight focus:outline-none focus:ring-0 focus:border-[#294a26]"
                        id="latitude"
                        style={{ transition: "border-color 0.3s" }}
                     />
                  </div>
                  <div className="mb-6">
                     <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="longitude"
                     >
                        Longitude:
                     </label>
                     <input
                        type="number"
                        step="any"
                        value={longitude}
                        readOnly // Users should not manually change the coordinate
                        className="appearance-none border-b border-gray-300 w-full py-2 leading-tight focus:outline-none focus:ring-0 focus:border-[#294a26]"
                        id="longitude"
                        style={{ transition: "border-color 0.3s" }}
                     />
                  </div>
                  <div className="flex items-center justify-center">
                     <button
                        type="submit"
                        className="bg-[#517028] hover:bg-[#294a26] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                     >
                        Submit Request
                     </button>
                  </div>
               </form>
            </div>
         </div>
         <ToastContainer />
      </div>
   );
};

export default RequestGenerate;
