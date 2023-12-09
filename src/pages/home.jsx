import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHippo, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import HomeCard from '../components/homeCard';
import SideNav from '../components/sideNav';
import Papa from 'papaparse';

export default function Home() {
	const [isNavOpen, setNavOpen] = useState(false);
	const [medicines, setMedicines] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);

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

	const findMedicinesWithCommonSalt = (query) => {
		const lowerCaseQuery = query.toLowerCase();
		const resultNames = new Set(); // Set to track unique product names

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

	useEffect(() => {
		if (searchTerm.trim()) {
			const results = findMedicinesWithCommonSalt(searchTerm);
			setSearchResults(results);
		} else {
			setSearchResults([]);
		}
	}, [searchTerm, medicines]);

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

			{/* Main Content */}
			<div
				className={`flex flex-col flex-1 justify-center items-center min-h-screen transition-margin duration-300 ${isNavOpen ? 'ml-64' : ''
					}`}
			>
				{/* Burger Icon */}
				<button
					className={`absolute top-4 left-4 cursor-pointer font-bold ${isNavOpen ? 'text-white' : 'text-black' }`}
					onClick={toggleNav}
				>
					<FontAwesomeIcon icon={faBars} size="lg" />
				</button>
				{/* Logo or Picture */}
				<div className="mb-4 mt-2">
					<img src="/logo.png" alt="Logo" className="w-32 mx-auto mb-2 sm:w-48 lg:w-64" />
				</div>

				{/* Search Form */}
				<form className="w-full max-w-md mb-8 mx-auto">
					<div className="flex items-center border-b border-[#517028] py-2">
						<input
							className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
							type="text"
							placeholder="Search for medicine..."
							aria-label="Medicine search"
							onChange={handleSearch}
							value={searchTerm}
						/>
						<FontAwesomeIcon className='text-[#294a26]' size='lg' icon={faMagnifyingGlass} />
						{/* <button
							className="flex-shrink-0 bg-[#517028] transition-all duration-300 hover:bg-[#294a26] text-white font-bold py-2 px-4 rounded"
							type="submit"
						>
							Search
						</button> */}

					</div>
					<ul className="list-none p-0 m-0">
						{searchResults.map((medicine, index) => (
							<li key={index} className="mb-2 overflow-hidden">
								<div
									className={`border-b ${index % 2 === 0 ? 'border-[#517028]' : 'border-[#294a26]'} rounded-full p-4`}
								>
									<p className="text-[#294a26]">
										<span className="font-bold">Name:</span> <i className='font-semibold'>{medicine.product_name}</i>
									</p>
									<p className="text-[#294a26]">
										<span className="font-bold">Salts:</span> <i className='font-semibold'>{medicine.salt_composition}</i>
									</p>
									{/* Add more details as needed */}
								</div>
							</li>
						))}
					</ul>



				</form>
				{/* HomeCards */}
				<div className="flex flex-col sm:flex-row flex-wrap justify-around w-full max-w-6xl mb-8">
					{/* HomeCard 1 */}
					<HomeCard
						imageSrc="/doseAlarm.png"
						altText="Dose Alarm"
						title="Dose Alarm"
						to="/doseAlarm"
					/>

					{/* HomeCard 2 */}
					<HomeCard
						imageSrc="/doctorConsultation.png"
						altText="Doctor Consultation"
						title="Doctor Consultation"
						to="/login"
					/>

					{/* HomeCard 3 */}
					<HomeCard
						imageSrc="/community.png"
						altText="Community"
						title="Community"
						to="/login"
					/>
				</div>
			</div>
		</div>
	);
}
