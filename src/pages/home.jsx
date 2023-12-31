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

export default function Home() {
	const [isNavOpen, setNavOpen] = useState(false);
	const [medicines, setMedicines] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [showCards, setShowCards] = useState(true);
	const [isPopupOpen, setPopupOpen] = useState(false); // New state for popup visibility
	const [isLoginOpen, setLoginOpen] = useState(false);
	const [isSignupOpen, setSignupOpen] = useState(false);

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
		// Load CSV data
		const fetchData = async () => {
			try {
				const response = await fetch('data.csv');
				const data = await response.text();
				const parsedData = Papa.parse(data, { header: true }).data;
				setMedicines(parsedData);
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

	return (
		<div className="flex">
			{/* Side Navigation */}
			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

			{/* Main Content and Popup Overlay */}
			<div className="flex-1 ">
				{/* Top Bar with Login and Sign Up Buttons */}
				<div className="absolute top-0 right-0 mt-4 mr-4 flex space-x-4">
					{/* Login Button */}
					<button className="text-[#294a26] font-semibold" onClick={handleLoginToggle}>
						Login
					</button>

					{/* Sign Up Button */}
					<button className="text-[#294a26] font-semibold" onClick={handleSignupToggle}>
						Sign Up
					</button>
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
							<FontAwesomeIcon className='text-[#294a26]' size='lg' icon={faMagnifyingGlass} />
						</div>
						{searchTerm.length > 1 && (
							<ul className={`list-none p-0 m-0 fade-out ${showCards ? 'fade-in' : ''}`}>
								{searchResults.map((medicine, index) => (
									<li key={index} className="mb-2 overflow-hidden">
										<div
											className={`border-b ${index % 2 === 0 ? 'border-[#517028]' : 'border-[#294a26]'} rounded-full p-4`}
										>
											<p className="text-[#294a26]">
												<span className="font-semibold">Name:</span> <i className='font-semibold'>{medicine.product_name}</i>
											</p>
											<p className="text-[#294a26]">
												<span className="font-semibold">Salts:</span> <i className='font-semibold'>{medicine.salt_composition}</i>
											</p>
										</div>
									</li>
								))}
							</ul>
						)}
					</form>

					{/* HomeCards */}
					{showCards && (
						<button onClick={handleLoginToggle} className={`flex flex-col sm:flex-row  flex-wrap justify-around w-full max-w-6xl mb-8 fade-out ${showCards ? 'fade-in' : ''}`}>
							{/* HomeCard 1 */}
							<HomeCard
								imageSrc="/doseAlarm.png"
								altText="Dose Alarm"
								title="Dose Alarm"
								to="/"
							/>

							{/* HomeCard 2 */}
							<HomeCard
								imageSrc="/doctorConsultation.png"
								altText="Doctor Consultation"
								title="Doctor Consultation"
								to="/"
							/>

							{/* HomeCard 3 */}
							<HomeCard
								imageSrc="/community.png"
								altText="Community"
								title="Community"
								to="/"
							/>
							
						</button>
					)}
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
						<Login handleClose={handleLoginToggle} />
					</div>
				)}

				{/* Signup Popup */}
				{isSignupOpen && (
					<div className="fixed top-0 left-0 w-full h-full z-30 flex justify-center items-center">
						<Signup handleClose={handleSignupToggle} />
					</div>
				)}
			</div>
		</div>
	);

}
