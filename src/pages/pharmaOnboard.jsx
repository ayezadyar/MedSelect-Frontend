import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { db, auth } from '../Firebase';
import { doc, updateDoc, getDoc, GeoPoint } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideNav from "../components/sideNav";
import "./contactStyle.css";
import { useNavigate } from "react-router-dom";
const PharmacyOnBoard = () => {
	const auth = getAuth();
	const [isNavOpen, setNavOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState('');
	const navigate = useNavigate();
	// Updated state with only necessary fields
	const [userName, setUserName] = useState('');
	const [emailAddress, setEmailAddress] = useState('');
	const [license, setLicense] = useState('');
	const [longitude, setLongitude] = useState('');
	const [latitude, setLatitude] = useState('');
	const [pharmacyName, setPharmacyName] = useState('');
	const toggleNav = () => setNavOpen(!isNavOpen);

	const handleChange = setter => event => {
		setter(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (currentUser) {
			const userDocRef = doc(db, "users", currentUser.uid); // Assuming you have a pharmacies collection
			try {
				await updateDoc(userDocRef, {
					userName,
					emailAddress,
					pharmaLicenseNumber: license, // Assuming you want to store it as licenseNumber
					location: new GeoPoint(parseFloat(latitude), parseFloat(longitude)), // Storing location as a GeoPoint
					isPharmacist: true,
					pharmacyName,
				});
				toast.info('Pharmacy data updated', {
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
				console.error("Error updating pharmacy:", error);
				// Optionally, show an error message
			}
		} else {
			console.log("No user to update");
		}
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
					setPharmacyName(userData.pharmacyName || '');
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

	console.log(currentUser, "in phaarma")
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
	return (
		<div className="flex">
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
				className={`flex flex-col justify-center items-center min-h-screen transition-margin duration-300 ${isNavOpen ? "ml-64" : ""}`}
			>
				{/* Burger Icon */}
				<button
					className={`absolute top-4 left-4 cursor-pointer font-bold ${isNavOpen ? "text-white" : "text-black"}`}
					onClick={toggleNav}
				>
					<FontAwesomeIcon icon={faBars} size="lg" />
				</button>

			</div>
			<>
				<div className="container m-auto">
					<h2 className="text-center font-bold text-2xl mb-6 text-[#294a26]">Pharmacy On Board</h2>
					<form action="#" onSubmit={handleSubmit}>
						<div className="form-row">
							<div className="input-data">
								<input type="text" value={userName} onChange={handleChange(setUserName)} disabled />
								<div className="underline"></div>
								<label>Username</label>
							</div>
							<div className="input-data">
								<input type="email" value={emailAddress} onChange={handleChange(setEmailAddress)} disabled />
								<div className="underline"></div>
								<label>Email Address</label>
							</div>
						</div>
						<div className="form-row">
							<div className="input-data">
								<input type="text" value={pharmacyName} onChange={handleChange(setPharmacyName)} required />
								<div className="underline"></div>
								<label>Pharmacy Name</label>
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
								<input type="number" value={latitude} onChange={handleChange(setLatitude)} required step="any" />
								<div className="underline"></div>
								<label>Latitude</label>
							</div>
							<div className="input-data">
								<input type="number" value={longitude} onChange={handleChange(setLongitude)} required step="any" />
								<div className="underline"></div>
								<label>Longitude</label>

							</div>
						</div>
						<center>
							<div className="submit-button-row cursor-pointer">
								<input type="submit" value="Submit" />
							</div>
						</center>
					</form>
				</div>
			</>
			<ToastContainer />
		</div>
	);
};

export default PharmacyOnBoard;
