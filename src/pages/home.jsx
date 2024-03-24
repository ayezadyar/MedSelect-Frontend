import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHippo, faMagnifyingGlass, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import HomeCard from '../components/homeCard';
import SideNav from '../components/sideNav';
import Papa from 'papaparse';
import Popup from '../components/videoModal';
import Signup from './Signup';
import Login from './login';


import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
export default function Home() {
	const [isNavOpen, setNavOpen] = useState(false);
	const [medicines, setMedicines] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [showCards, setShowCards] = useState(true);
	const [isPopupOpen, setPopupOpen] = useState(false); // New state for popup visibility
	const [isLoginOpen, setLoginOpen] = useState(false);
	const [isSignupOpen, setSignupOpen] = useState(false);
	const [isLoading, setisLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);
	const [isLogOut, setIsLogOut] = useState(true);
	const [isPharmacist, setIsPharamcist] = useState(false);
	const [isMedRequest, setIsMedRequest] = useState(false);

	const auth = getAuth();


	const handleLoginToggle = () => {
		setLoginOpen(!isLoginOpen);
		setSignupOpen(false); // Close signup popup when opening login popup
	};

	const handleSignupToggle = () => {
		setSignupOpen(!isSignupOpen);
		setLoginOpen(false); // Close login popup when opening signup popup
	};
	const handlePopupToggle = () => {
		setPopupOpen(!isPopupOpen);
	};


	useEffect(() => {
		// Listen for authentication state changes
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				// If there's a user, we set it
				setCurrentUser(user);
			} else {
				// User is signed out
				setCurrentUser(null);
			}
		});

		return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
	}, []);


	useEffect(() => {
		// Load CSV data
		const fetchData = async () => {
			try {
				const response = await fetch('data11.csv');
				const data = await response.text();
				const parsedData = Papa.parse(data, { header: true }).data;
				setMedicines(parsedData);
				setisLoading(false);

			} catch (error) {
				console.error("Error loading CSV data:", error);
			}
		};

		fetchData();

	}, []);

	useEffect(() => {
		if (searchTerm.trim() && searchTerm.length > 1) {
			const results = findMedicinesWithCommonSalt(searchTerm);
			setSearchResults(results);
			setShowCards(false);
		} else {
			setSearchResults([]);
			setShowCards(true);
		}
	}, [searchTerm, medicines]);

	const findMedicinesWithCommonSalt = (query) => {
		const lowerCaseQuery = query.toLowerCase();
		const resultNames = new Set();

		const searchedMedicine = medicines.find(medicine =>
			typeof medicine.product_name === 'string' &&
			medicine.product_name.toLowerCase().includes(lowerCaseQuery)
		);

		if (!searchedMedicine || typeof searchedMedicine.salt_composition !== 'string') {
			return [];
		}

		return medicines.filter(medicine => {
			const isUnique = !resultNames.has(medicine.product_name);
			const isSameSalt = typeof medicine.salt_composition === 'string' &&
				medicine.salt_composition.toLowerCase() === searchedMedicine.salt_composition.toLowerCase();

			if (isUnique && isSameSalt) {
				resultNames.add(medicine.product_name);
				return true;
			}
			return false;
		});
	};

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	const toggleNav = () => {
		setNavOpen(!isNavOpen);
	};
	// const [currentUser, setCurrentUser] = useState('')
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
					setIsMedRequest(userDetails.isMedRequest)
					setIsPharamcist(userDetails.isPharmacist);
					console.log(userDetails)
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
	const determinePath = () => {
		if (currentUser?.email) {
			if (isPharmacist) {
				return "/requestHandle";
			} else if (isMedRequest) {
				return "/map";
			} else {
				return "/requestGenerate";
			}
		}
		return "/";
	};

	// Use the function to get the path
	const path = determinePath();
	console.log(isMedRequest, 'medRequest', isPharmacist, 'pharma')
	return (
		<div className="flex">
			{/* Side Navigation */}
			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} isLogout={isLogOut} />

			{/* Main Content and Popup Overlay */}
			<div className="flex-1 ">
				{/* Top Bar with Login and Sign Up Buttons */}
				<div className="absolute top-0 right-0 mt-4 mr-4 flex space-x-4">
					{currentUser ? (
						// If there is a logged-in user, display their email and a logout button
						<>
							<p>{currentUser?.email}</p>

						</>
					) : (
						// If there is no logged-in user, display login and signup buttons
						<>
							<button className="text-[#294a26] font-semibold" onClick={handleLoginToggle}>
								Login
							</button>
							<button className="text-[#294a26] font-semibold" onClick={handleSignupToggle}>
								Sign Up
							</button>
						</>
					)}
				</div>
				{/* Main Content with conditional blur */}
				<div
					className={`flex flex-col justify-center items-center min-h-screen transition-margin duration-300 ${isNavOpen ? 'ml-64' : ''
						} ${isPopupOpen || isLoginOpen || isSignupOpen ? 'blur-sm' : ''}`}
				>
					{/* Burger Icon */}
					<button
						className={`absolute top-4 left-4 cursor-pointer font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
						onClick={toggleNav}
					>
						<FontAwesomeIcon icon={faBars} size="lg" />
					</button>

					{/* Question Mark Icon */}
					<button className="absolute top-14 right-4 z-10">
						<FontAwesomeIcon
							icon={faQuestionCircle}
							size="lg"
							title="How it works"
							className="cursor-pointer"
							onClick={handlePopupToggle}
						/>
					</button>
					{/* Logo or Picture */}
					<div className="mb-4 mt-2">
						<img src="/logo.png" alt="Logo" className="w-32 mx-auto mb-2 sm:w-48 lg:w-64" />
					</div>

					{/* Search Form */}


					<form className="w-full max-w-md mb-8 mx-auto">
						{isLoading ? (

							<div>

							</div>

						) : (
							<div className="flex items-center border-b border-[#517028] py-2">
								<input
									autoFocus
									className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
									type="text"
									placeholder="Search for medicine..."
									aria-label="Medicine search"
									onChange={handleSearch}
									value={searchTerm}
								/>
								<FontAwesomeIcon className="text-[#294a26]" size="lg" icon={faMagnifyingGlass} />
							</div>
						)}
						{searchTerm.length > 1 && (
							<ul className={`list-none p-0 m-0 fade-out ${showCards ? 'fade-in' : ''}`}>
								{searchResults.map((medicine, index) => (
									<li key={index} className="mb-2 overflow-hidden">
										<div
											className={`border-b ${index % 2 === 0 ? 'border-[#517028]' : 'border-[#294a26]'} rounded-full p-4`}
										>
											<p className="text-[#294a26]">
												<span className="font-semibold">Name:</span> <i className="font-semibold">{medicine.product_name}</i>
											</p>
											<p className="text-[#294a26]">
												<span className="font-semibold">Salts:</span> <i className="font-semibold">{medicine.salt_composition}</i>
											</p>
										</div>
									</li>
								))}
							</ul>
						)}
					</form>
					{/* HomeCards */}
					{showCards ? (
						isLoading ? (
							<div className="flex flex-row flex-wrap justify-around w-full max-w-6xl mb-8 fade-out fade-in">
								{/* Loading Skeletons */}
								{[1, 2, 3, 4].map((index) => (
									<div key={index} className="w-48 h-48 bg-gray-200 animate-pulse rounded-lg overflow-hidden mx-4 my-2">
										<div className="h-full w-1/2 bg-gray-300"></div>
									</div>
								))}
							</div>
						) : (
							<button onClick={currentUser?.email ? null : handleLoginToggle} className="flex flex-row flex-wrap justify-around w-full max-w-6xl mb-8 fade-out fade-in">
								{/* HomeCard 1 */}

								<HomeCard
									imageSrc="/doseAlarm.png"
									altText="Dose Alarm"
									title="Dose Alarm"
									to={currentUser?.email ? "/doseAlarm" : '/'}
								/>

								{/* HomeCard 2 */}

								<HomeCard
									imageSrc="/doctorConsultation.png"
									altText="Doctor Consultation"
									title="Doctor Consultation"
									to={currentUser?.email ? "/doctors" : '/'}
								/>

								{/* HomeCard 3 */}

								<HomeCard
									imageSrc="/community.png"
									altText="Community"
									title="Community"
									to={currentUser?.email ? "/chat" : '/'}
								/>

								{/* HomeCard 4 */}

								<HomeCard
									imageSrc="/map.png"
									altText="Fourth Card"
									title="Medicine Request"
									to={path}
								/>
							</button>
						)
					) : null}
				</div>

				{/* Popup Overlay and Content */}
				{isPopupOpen && (
					<div className="fixed top-0 left-0 w-full h-full z-30 flex justify-center items-center">
						<Popup handleClose={handlePopupToggle}>
							{/* Popup content goes here */}
							<p>This is the popup content.</p>
						</Popup>
					</div>
				)}
				{/* Login Popup */}
				{isLoginOpen && (
					<div className="fixed top-0 left-0 w-full h-full z-30 flex justify-center items-center">
						<Login setLoginOpen={setLoginOpen} />
					</div>
				)}

				{/* Signup Popup */}
				{isSignupOpen && (
					<div className="fixed top-0 left-0 w-full h-full z-30 flex justify-center items-center">
						<Signup setSignupOpen={setSignupOpen} />
					</div>
				)}
			</div>
		</div>
	);

}
