import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { db } from '../Firebase';
import "./contactStyle.css";
import SideNav from "../components/sideNav";
import { doc, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from 'react-firebase-hooks/firestore';

const DoctorOnBoard = () => {
    const [isNavOpen, setNavOpen] = useState(false);
    const [currentUser, loading] = useAuthState(auth);
    const userDocRef = currentUser ? doc(db, 'users', currentUser.uid) : null;
    const [userData] = useDocumentData(userDocRef);

    const [experience, setExperience] = useState('');
    const [license, setLicense] = useState('');
    const [domain, setDomain] = useState('');

    const toggleNav = () => setNavOpen(!isNavOpen);

    useEffect(() => {
        if (userData) {
            setExperience(userData.experience || '');
            setLicense(userData.licenseNumber || '');
            setDomain(userData.domain || '');
        }
    }, [userData]);

    const handleExperienceChange = (event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value) && (value === "" || parseInt(value, 10) < 50)) {
            setExperience(value);
        }
    };

    const handleLicenseChange = (event) => {
        const value = event.target.value;
        if (/^[A-Z]{0,2}-\d{5}-[A-Z]{0,2}$/.test(value)) {
            setLicense(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (currentUser && userDocRef) {
            try {
                await updateDoc(userDocRef, {
                    experience: experience,
                    domain: domain,
                    licenseNumber: license,
                    isDoctor: true
                });
                toast.info('User data updated', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } catch (error) {
                console.error("Error updating user:", error);
            }
        } else {
            console.log("No user to update");
        }
    };

    return (
        <div className="flex overflow-hidden">
            <SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
            <div className={`flex flex-col justify-center items-center min-h-screen transition-margin duration-300 w-full ${isNavOpen ? "ml-64" : "ml-0"}`}>
                <button className={`absolute top-4 left-4 z-20 cursor-pointer font-bold ${isNavOpen ? "text-white" : "text-black"}`} onClick={toggleNav}>
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </button>
                <div className="container px-4 md:px-8 lg:px-16">
                    <h2 className="text-center font-bold text-2xl mb-6 text-[#294a26]">Doctors On Board</h2>
                    <form action="#" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="input-data">
                                <input type="text" value={userData?.displayName || ''} disabled />
                                <div className="underline"></div>
                                <label>User Name</label>
                            </div>
                            <div className="input-data">
                                <input type="email" value={userData?.email || ''} disabled />
                                <div className="underline"></div>
                                <label>Email Address</label>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="input-data">
                                <input type="text" value={experience} onChange={handleExperienceChange} required />
                                <div className="underline"></div>
                                <label>Experience (Years)</label>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="input-data">
                                <input type="text" value={license} onChange={handleLicenseChange} required />
                                <div className="underline"></div>
                                <label>License Number (XX-00000-XX)</label>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="input-data">
                                <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} required />
                                <div className="underline"></div>
                                <label>Domain</label>
                            </div>
                        </div>
                        <center>
                            <div className="submit-button-row cursor-pointer">
                                <input type="submit" value="Submit" />
                            </div>
                        </center>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default DoctorOnBoard;
