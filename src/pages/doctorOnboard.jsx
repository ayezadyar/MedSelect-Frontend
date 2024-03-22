import React from 'react';

const DoctorOnBoard = () => {
	return (
		<div className="bg-white text-gray-800 p-5">
			<h2 className="text-center text-2xl font-bold mb-6">Doctors On Board</h2>
			<form className="max-w-md mx-auto">
				<div className="mb-4">
					<label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
					<input type="text" id="firstName" className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
				</div>
				<div className="mb-4">
					<label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
					<input type="text" id="lastName" className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
				</div>
				<div className="mb-4">
					<label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
					<input type="email" id="email" className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
				</div>
				<div className="mb-4">
					<label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience (Years)</label>
					<input type="number" id="experience" className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
				</div>
				<div className="mb-4">
					<label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">License Number</label>
					<input type="text" id="licenseNumber" className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
				</div>
				<div className="mb-4">
					<label htmlFor="domain" className="block text-sm font-medium text-gray-700">Domain</label>
					<input type="text" id="domain" className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm" />
				</div>
				<div className="text-center">
					<button type="submit" className="mt-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}

export default DoctorOnBoard;
