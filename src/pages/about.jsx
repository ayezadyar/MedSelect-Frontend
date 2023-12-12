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
							src="logo.png"
							alt="About Us"
							className="w-96 h-auto object-cover rounded-tr-full rounded-bl-ful"
						/>
					</div>


					<div className="w-full md:w-1/2 p-4 md:p-8 bg-[#517028] flex items-center justify-center">
						<div className="text-center md:text-left">
							<h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
								About Us
							</h2>
							<p className="text-lg md:text-xl text-white mb-8">
								Welcome to my premier real estate agency, where our mission is to provide exceptional service and expertise to help our clients achieve their real estate goals. With years of experience in the industry, our team of dedicated professionals has built a reputation for excellence and integrity.
								<br />
								<br />
								We are committed to staying up-to-date with the latest trends and technologies in the real estate market, and we use our knowledge and expertise to guide our clients through the buying and selling process with confidence.
							</p>
						</div>
					</div>
				</div>
			</div>
			{/* Introduction Section */}

			<div className="bg-[#294a26] text-white p-8 rounded-xl shadow-md">
				<h2 className="text-3xl font-bold mb-4 text-center text-white">Introduction</h2>
				<p className="text-lg mb-8 leading-loose">
					Medselect is a meticulously designed and comprehensive platform that serves as an invaluable resource for individuals seeking essential information about medications. It offers a range of essential services to empower users in their healthcare decision-making journey. Firstly, it provides Informative Insights, ensuring that users have access to valuable information about alternative or substitute medicines, helping them make well-informed choices regarding their treatment options. Secondly, Medselect offers Effortless Locating by swiftly identifying nearby pharmacies that stock the required medication, simplifying the often cumbersome procurement process. Additionally, Medselect stands out by providing opportunities for Expert Consultations, allowing users to engage with verified specialists and experienced pharmacists who offer personalized guidance on specific medicines. Furthermore, the platform fosters a Vibrant Community forum where users can engage in discussions, sharing their experiences, and discussing the advantages and disadvantages of particular medications. This sense of community support facilitates informed decisions and enhances the overall healthcare experience for users.
				</p>
			</div>
		</>
	);
}


