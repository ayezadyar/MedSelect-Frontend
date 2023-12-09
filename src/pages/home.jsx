import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHippo } from "@fortawesome/free-solid-svg-icons";
import HomeCard from '../components/homeCard';
import SideNav from '../components/sideNav';

export default function Home() {
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
						/>
						<button
							className="flex-shrink-0 bg-[#517028] transition-all duration-300 hover:bg-[#294a26] text-white font-bold py-2 px-4 rounded"
							type="submit"
						>
							Search
						</button>

					</div>
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
