import React from 'react';
import Login from './login';
import Header from '../components/header';
import { Link } from "react-router-dom"

export default function Home() {
	return (
		<div>
			{/* <Header/> */}
			<div className="flex flex-col justify-center items-center min-h-screen">

				{/* Logo or Picture */}
				<div className="mb-4 mt-2">
					<img src="/logo.png" alt="Logo" className="w-32 mx-auto mb-2 sm:w-48 lg:w-64" />
				</div>

				{/* Search Form */}
				<form className="w-full max-w-md mb-8 mx-auto">
					<div className="flex items-center border-b border-teal-500 py-2">
						<input
							className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
							type="text"
							placeholder="Search for medicine..."
							aria-label="Medicine search"
						/>
						<button
							className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded hover:scale-110"
							type="submit"
						>
							Search
						</button>
					</div>
				</form>

				{/* Cards */}
				<div className="flex flex-col sm:flex-row flex-wrap justify-around w-full max-w-6xl mb-8">

					{/* Card 1 */}
					<div className="w-full mb-4 relative overflow-hidden rounded-lg sm:w-1/2 lg:w-1/3 xl:w-1/4">
						<div className="bg-teal-500 shadow-md rounded p-4 h-64 text-white cursor-pointer hover:bg-teal-700 transition-all duration-300 hover:scale-110">
							<Link to="/login">
								<div className="flex flex-col items-center">
									<img
										src="/doseAlarm.png"
										alt="Dose Alarm"
										className="w-28 h-28 mx-auto my-10 mb-2 object-cover rounded"
									/>
									<h2 className="text-base sm:text-lg font-semibold mb-2">DOSE ALARM</h2>
								</div>
							</Link >
						</div>
						<div className="hidden absolute top-full left-0 w-full bg-white p-4 rounded shadow-md opacity-0 transition-opacity duration-300">

						</div>
					</div>

					{/* Card 2 */}
					<div className="w-full mb-4 relative overflow-hidden rounded-lg sm:w-1/2 lg:w-1/3 xl:w-1/4">
						<div className="bg-teal-500 shadow-md rounded p-4 h-64 text-white cursor-pointer hover:bg-teal-700 transition-all duration-300 hover:scale-110">
							<Link to="/login">
								<div className="flex flex-col items-center">
									<img
										src="/doctorConsultation.png"
										alt="Doctor Consultation"
										className="w-28 h-28 mx-auto my-10 mb-2 object-cover rounded"
									/>
									<h2 className="text-base sm:text-lg font-semibold mb-2">Doctor Consultation</h2>
								</div>
							</Link>
						</div>
						<div className="hidden absolute top-full left-0 w-full bg-white p-4 rounded shadow-md opacity-0 transition-opacity duration-300">

						</div>
					</div>

					{/* Card 3 */}
					<div className="w-full mb-4 relative overflow-hidden rounded-lg sm:w-1/2 lg:w-1/3 xl:w-1/4">
						<div className="bg-teal-500 shadow-md rounded p-4 h-64 text-white cursor-pointer hover:bg-teal-700 transition-all duration-300 hover:scale-110">
							<Link to="/login">

								<div className="flex flex-col items-center">
									<img
										src="/community.png"
										alt="Community"
										className="w-28 h-28 mx-auto my-10 mb-2 object-cover rounded"
									/>
									<h2 className="text-base sm:text-lg font-semibold mb-2">Community</h2>
								</div>
							</Link>

						</div>
						<div className="hidden absolute top-full left-0 w-full bg-white p-4 rounded shadow-md opacity-0 transition-opacity duration-300">
							{/* <Login /> */}

						</div>
					</div>

				</div>
			</div>
		</div>
	);
}
