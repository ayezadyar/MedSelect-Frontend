import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import SideNav from '../sideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import '../../pages/contactStyle.css'
const RequestHandle = () => {
	const [requests, setRequests] = useState([]);
	const [expandedUserId, setExpandedUserId] = useState(null);
	const [isNavOpen, setNavOpen] = useState(false);

	useEffect(() => {
		const fetchRequests = async () => {
			const q = query(collection(db, 'medRequest'), where('isCurrentlyActive', '==', true));
			const querySnapshot = await getDocs(q);
			const fetchedRequests = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
				loading: true, // Add a loading state to each request
			}));
			setRequests(fetchedRequests);

			fetchedRequests.forEach((request) => {
				setTimeout(async () => {
					await updateDoc(doc(db, 'medRequest', request.id), {
						isCurrentlyActive: false,
					});
					setRequests(currentRequests => currentRequests.map(r =>
						r.id === request.id ? { ...r, loading: false } : r
					));
				}, 20000); // 20 seconds
			});
		};

		fetchRequests();
	}, []);

	const toggleNav = () => {
		setNavOpen(!isNavOpen);
	};

	return (
		<div className="flex flex-col lg:flex-row rounded-lg">
			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
			<div className={`flex-1 ${isNavOpen ? 'lg:ml-64' : 'lg:ml-0'} transition-all duration-300 ease-in-out`}>
				<button
					className={`absolute top-4 left-4 z-50 cursor-pointer text-2xl font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
					onClick={toggleNav}
				>
					<FontAwesomeIcon icon={faBars} size="sm" />
				</button>
				<h1 className="text-center my-6 font-semibold text-xl lg:text-2xl text-[#294a26] px-6">Active Request</h1>
				<div className="overflow-auto px-6">
					{requests.map((request) => (
						<div
							key={request.id}
							className="my-4 mx-1 lg:mx-4 p-6 border-b border-gray-200 rounded-3xl bg-[#517028] shadow-lg cursor-pointer hover:shadow-2xl transition-shadow duration-300 ease-in-out relative"
							onClick={() => setExpandedUserId(expandedUserId === request.id ? null : request.id)}
						>
							<div className="flex justify-between items-center">
								<h5 className="text-lg text-white">{request.medicineName}</h5>
								<p className="text-white cursor-pointer">{request.loading ? "Loading..." : "Expired"}</p>
							</div>
							{expandedUserId === request.id && request.location && (
								<div className="mt-2 text-white">
									<p className='font-semibold'>Latitude: <span className='font-normal'>{request.location._lat}</span></p>
									<p className='font-semibold'>Longitude: <span className='font-normal'>{request.location._long}</span></p>
								</div>
							)}
							{/* Reserve space for the loading bar */}
							<div className="absolute bottom-0 left-0 ml-2 w-[100%] h-2">
								{request.loading ? (
									<div className="bg-[#294a26] h-2 rounded-b-3xl loadingBar"></div>
								) : (
									<div className="h-1"></div> // Transparent div to maintain consistent height
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);


};

export default RequestHandle;
