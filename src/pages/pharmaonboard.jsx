import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { db, auth } from '../Firebase';
import { doc, updateDoc, getDoc, GeoPoint } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, updatePassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideNav from "../components/sideNav";
import "./contactStyle.css";

const PharmacyOnBoard = () => {
    const auth = getAuth();
    const [isNavOpen, setNavOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState('');
    const [isLoading, setLoading] = useState(false);

    // Updated state with only necessary fields
    const [userName, setUserName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [license, setLicense] = useState('');
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');

    const toggleNav = () => setNavOpen(!isNavOpen);

    const handleChange = setter => event => {
        setter(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid); // Assuming you have a pharmacies collection
            try {
                await updateDoc(userDocRef, {
                    userName,
                    emailAddress,
                    pharmaLicenseNumber: license, // Assuming you want to store it as licenseNumber
                    location: new GeoPoint(parseFloat(latitude), parseFloat(longitude)), // Storing location as a GeoPoint
                    isPharmacist: true
                });
                toast.info('Pharmacy data updated', { /* Toast message */ });
            } catch (error) {
                console.error("Error updating pharmacy:", error);
                toast.error('Error updating pharmacy', { /* Toast message for error */ });
            } finally {
                setLoading(false);
            }
        } else {
            console.log("No user to update");
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        const newPassword = prompt("Enter new password:");
        if (newPassword) {
            try {
                await updatePassword(auth.currentUser, newPassword);
                toast.success('Password updated successfully', { /* Toast message */ });
            } catch (error) {
                console.error("Error updating password:", error);
                toast.error('Error updating password', { /* Toast message for error */ });
            }
        }
    };

    const handleLogout = () => {
        auth.signOut();
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                const userDocRef = doc(db, 'users', user.uid); // Use 'pharmacies' collection
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setUserName(userData.displayName || '');
                    setEmailAddress(userData.email || '');
                    setLicense(userData.pharmaLicenseNumber || '');
                    if (userData.location) {
                        setLongitude(userData.location.longitude.toString());
                        setLatitude(userData.location.latitude.toString());
                    }
                } else {
                    console.log('No such document!');
                }
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
    }, []);

    const handleLicenseChange = (event) => {
        const value = event.target.value;
        if (/^[A-Z]{0,2}-\d{5}-[A-Z]{0,2}$/.test(value)) {
            setLicense(value);
        } else {
            console.log("Invalid license format.");
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
                    <h2 className="text-center font-bold text-2xl mb-6 text-[#294a26]">Pharmacy On Board</h2>
                    <form action="#" onSubmit={handleSubmit}>
                        {/* Form inputs */}
                    </form>
                    <div className="flex justify-between mt-4">
                        <button className="btn-secondary" onClick={handlePasswordUpdate}>Update Password</button>
                        <button className="btn-secondary" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
            <ToastContainer />
            {isLoading && <div className="absolute inset-0 bg-gray-900 opacity-50 flex justify-center items-center"><div className="loader"></div></div>}
        </div>
    );
};

export default PharmacyOnBoard;
