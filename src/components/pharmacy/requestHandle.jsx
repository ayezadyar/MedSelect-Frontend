import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase'; // Assuming you have a firebase.js file where your Firebase is configured
import SideNav from '../sideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const RequestHandle = () => {
	const [requests, setRequests] = useState([]);

	useEffect(() => {
		const fetchRequests = async () => {
			const q = query(collection(db, 'medRequest'), where('isCurrentlyActive', '==', true));
			const querySnapshot = await getDocs(q);
			const fetchedRequests = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}));
			setRequests(fetchedRequests);
		};

		fetchRequests();
	}, []);
	const [expandedUserId, setExpandedUserId] = useState(null); // Track expanded user
	console.log(requests, "med reqeuest")
	// Toggle expanded user description
	const toggleUserDescription = (userId) => {
		setExpandedUserId(expandedUserId === userId ? null : userId);
	};

	const [isNavOpen, setNavOpen] = useState(false);

	const toggleNav = () => {
		setNavOpen(!isNavOpen);
	};
	return (
		<div className="flex flex-col lg:flex-row rounded-lg">
			{/* Side Navigation */}
			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

			{/* Main Content */}
			<div className={`flex-1 ${isNavOpen ? 'lg:ml-64' : 'lg:ml-0'} transition-all duration-300 ease-in-out`}>
				{/* Burger Icon for toggling SideNav */}
				<button
					className={`absolute top-4 left-4 z-50 cursor-pointer text-2xl font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
					onClick={toggleNav}
				>
					<FontAwesomeIcon icon={faBars} size="sm" />
				</button>

				<h1 className="text-center my-6 font-semibold text-xl lg:text-2xl text-[#294a26] px-6">Active Request</h1>
				<div className="overflow-auto px-6">
					{requests.map((request) => (
						(
							<div
								key={request.uid}
								className="my-4 mx-1 lg:mx-4 p-6 border-b border-gray-200 rounded-3xl bg-[#517028] shadow-lg cursor-pointer hover:shadow-2xl transition-shadow duration-300 ease-in-out"
								onClick={() => toggleUserDescription(request.id)}
							>
								<div className="flex justify-between items-center">
									<h5 className="text-lg text-white">{request.medicineName}</h5>
									<p onClick={(e) => {
										e.stopPropagation();
										// handleUserSelect(request.id);
									}} className="text-white cursor-pointer">Response</p>
								</div>
								{expandedUserId === request.id && request?.location._lat && (
									<div className="mt-2 text-white">
										<p className='font-semibold'>{`Latitude : `}<span className='font-normal font-sans'>{`${request?.location._lat}`}</span></p>
										<p className='font-semibold'>{`Longitude : `}<span className='font-normal font-sans'>{`${request?.location._long}`}</span></p>
									</div>
								)}
							</div>
						)
					))}
				</div>
			</div>
		</div>
	);
};

export default RequestHandle;
