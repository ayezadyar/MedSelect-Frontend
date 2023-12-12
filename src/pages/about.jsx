import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHippo, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import HomeCard from '../components/homeCard';
import SideNav from '../components/sideNav';
import Papa from 'papaparse';

export default function About() {
	const [isNavOpen, setNavOpen] = useState(false);

	const toggleNav = () => {
		setNavOpen(!isNavOpen);
	};

	return (
		<>
			<div className="flex rounded-lg">
				{/* Side Navigation */}
				<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

				{/* Main Content */}
				<div
					className={`flex flex-col flex-1 justify-center items-center min-h-screen transition-margin duration-300 ${isNavOpen ? 'ml-64' : ''}`}
				>
					{/* Burger Icon */}
					<button
						className={`absolute top-4 left-4 cursor-pointer font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
						onClick={toggleNav}
					>
						<FontAwesomeIcon icon={faBars} size="lg" />
					</button>

				</div>
				<div id="about" className="flex flex-col md:flex-row w-full h-screen ">

					<div className="w-full md:w-1/2 p-0 md:p-8 flex items-center justify-center ">

						<img
							src="fast.png"
							alt="About Us"
							className="w-full h-auto object-cover  rounded-bl-ful"
						/>
					</div>


					<div className="w-full md:w-1/2 p-4 md:p-8 bg-[#517028] flex items-center justify-center">
						<div className="text-center md:text-left">
							<h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
								About Us
							</h2>
							<p className="text-lg md:text-xl text-white mb-8">
								Medselect is an innovative healthcare platform providing informed decision-making tools. Services include identifying alternative medicines, locating nearby pharmacies, and offering expert consultations. The vibrant community forum encourages shared experiences and insights. Medselect empowers users with comprehensive information for confident healthcare navigation. It enhances individuals' ability to make informed and effective medical treatment decisions.
							</p>
						</div>
					</div>
				</div>
			</div>
			
			<div id="about" className="flex flex-col md:flex-row w-full h-screen ">

				

				<div className="w-full md:w-1/2 p-4 md:p-8 bg-[#517028] flex items-center justify-center">
					<div className="text-center md:text-left">
						<h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
							Introduction
						</h2>
						<p className="text-lg md:text-xl text-white mb-8">
							Medselect is a comprehensive platform offering Informative Insights on medications, aiding users in making informed treatment choices. It provides Effortless Locating of nearby pharmacies for streamlined procurement. Expert Consultations connect users with verified specialists for personalized guidance. The Vibrant Community forum fosters discussions and shared experiences for informed decisions. Overall, Medselect enhances the healthcare journey by empowering users with essential information and community support.
						</p>
					</div>
				</div>
				<div className="w-full md:w-1/2 p-0 md:p-8 flex items-center justify-center ">

					<img
						src="logo.png"
						alt="About Us"
						className="w-96 h-auto object-cover  rounded-bl-ful"
					/>
				</div>
			</div>

		</>
	);
}


