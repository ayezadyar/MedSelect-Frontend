import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { db, auth } from '../Firebase';
// import { collection, query, onSnapshot } from 'firebase/firestore';
import "./contactStyle.css";
import SideNav from "../components/sideNav";
import { collection, query, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const DoctorOnBoard = () => {

	const navigate = useNavigate();
	const auth = getAuth();
	const [isNavOpen, setNavOpen] = useState(false);

	const [userName, setUserName] = useState('');
	const [emailAddress, setEmailAddress] = useState('');
	const [experience, setExperience] = useState('');
	const [license, setLicense] = useState('');
	const [domain, setDomain] = useState('');

	const toggleNav = () => setNavOpen(!isNavOpen);
	const handleExperienceChange = (event) => {
		const value = event.target.value;
		if (/^\d*$/.test(value) && (value === "" || parseInt(value, 10) < 50)) {
			setExperience(value);
		}
	};

	const handleLicenseChange = (event) => {
		const value = event.target.value;
		console.log("Input value:", value); // Check the input value
		if (/^[A-Z]{0,2}-\d{5}-[A-Z]{0,2}$/.test(value)) {
			console.log("Valid license format."); // Check if it detects valid format
			setLicense(value);
		} else {
			console.log("Invalid license format."); // Check if it detects invalid format
		}
	};


	const handleChange = (setter) => (event) => {
		setter(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault(); // Prevent default form submission

		if (currentUser) {
			const userDocRef = doc(db, "users", currentUser.uid); // Reference to the user's document

			try {
				await updateDoc(userDocRef, {
					experience: experience,
					domain: domain,
					licenseNumber: license, // Assuming you want to store it as licenseNumber
					isDoctor: true
				});
				console.log("User updated successfully");
				toast.info(('User data updated'), {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
				});
				// Optionally, redirect the user or show a success message
				setTimeout(() => navigate("/"), 5000);
			} catch (error) {
				console.error("Error updating user:", error);
				// Optionally, show an error message
			}
		} else {
			console.log("No user to update");
			// Handle case when there is no user logged in or selected
		}
		console.log('edit function called');
	};


	const [currentUser, setCurrentUser] = useState('')
	useEffect(() => {
		// Listen for authentication state changes
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				// If there's a user, we set it
				setCurrentUser(user);

				// Get the user's document from Firestore
				const userDocRef = doc(db, 'users', user.uid);
				const userDocSnap = await getDoc(userDocRef);

				if (userDocSnap.exists()) {
					// Extract user details from the document
					const userDetails = userDocSnap.data();
					setEmailAddress(userDetails.email)
					setDomain(userDetails.domain)
					setExperience(userDetails.experience)
					setUserName(userDetails.displayName)
					setLicense(userDetails.licenseNumber)

				} else {
					console.log('No such document!');
				}
			} else {
				// User is signed out
				setCurrentUser(null);
			}
		});

		return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
	}, []);

	console.log(currentUser, 'current user')
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
								<input type="text" value={userName} onChange={handleChange(setUserName)} disabled />
								<div className="underline"></div>
								<label>User Name</label>
							</div>
							<div className="input-data">
								<input type="email" value={emailAddress} onChange={handleChange(setEmailAddress)} disabled />
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
								<input type="text" value={domain} onChange={handleChange(setDomain)} required />
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
