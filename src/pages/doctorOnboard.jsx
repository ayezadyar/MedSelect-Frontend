import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./contactStyle.css";
import SideNav from "../components/sideNav";

const DoctorOnBoard = () => {
	const [isNavOpen, setNavOpen] = useState(false);

	const toggleNav = () => {
		setNavOpen(!isNavOpen);
	};

	return (
		<div className="flex overflow-hidden">
			{/* Side Navigation */}
			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

			{/* Main Content */}
			<div
				className={`flex flex-col justify-center items-center min-h-screen transition-margin duration-300 w-full ${isNavOpen ? "ml-64" : "ml-0"}`}
			>
				{/* Burger Icon */}
				<button
					className={`absolute top-4 left-4 z-20 cursor-pointer font-bold ${isNavOpen ? "text-white" : "text-black"}`}
					onClick={toggleNav}
				>
					<FontAwesomeIcon icon={faBars} size="lg" />
				</button>

				{/* Adjust container padding/margin for responsiveness */}
				<div className="container px-4 md:px-8 lg:px-16">
					<h2 className="text-center font-bold text-2xl mb-6">Doctors On Board</h2>
					<form action="#">
						<div className="form-row">
							{/* Make input and labels responsive */}
							{/* User Name */}
							<div className="input-data">
								<input type="text" required />
								<div className="underline"></div>
								<label>User Name</label>
							</div>
							{/* Email Address */}
							<div className="input-data">
								<input type="email" required />
								<div className="underline"></div>
								<label>Email Address</label>
							</div>
						</div>
						{/* Experience (Years) */}
						<div className="form-row">
							<div className="input-data">
								<input type="text" required />
								<div className="underline"></div>
								<label>Experience (Years)</label>
							</div>
						</div>
						{/* License Number */}
						<div className="form-row">
							<div className="input-data">
								<input type="text" required />
								<div className="underline"></div>
								<label>License Number</label>
							</div>
						</div>
						{/* Domain */}
						<div className="form-row">
							<div className="input-data">
								<input type="text" required />
								<div className="underline"></div>
								<label>Domain</label>
							</div>
						</div>
						<center>
							<div className="form-row bg-[#517028] hover:bg-[#294a26] text-white overflow-hidden w-44 rounded-md cursor-pointer">
								<div className="input-data">
									<div className="inner"></div>
									<input type="submit" value="submit" />
								</div>
							</div>
						</center>
					</form>
				</div>
			</div>
		</div>
	);
}

export default DoctorOnBoard;
