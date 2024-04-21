import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, getDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../Firebase';
import SideNav from '../sideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import '../../pages/contactStyle.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const RequestHandle = () => {
	const [requests, setRequests] = useState([]);
	const [expandedUserId, setExpandedUserId] = useState(null);
	const [isNavOpen, setNavOpen] = useState(false);
	const [requestTimers, setRequestTimers] = useState({}); // New state to track timers

	useEffect(() => {
		// Assuming requests are fetched and set elsewhere in your component
		requests.forEach(request => {
			// For each request, set a timer if not already set
			if (!requestTimers[request.id]) {
				const timer = setTimeout(() => deleteRequest(request.id), 20000); // 20 seconds timer
				setRequestTimers(prev => ({ ...prev, [request.id]: timer }));
			}
		});

		// Cleanup timers on component unmount
		return () => {
			Object.values(requestTimers).forEach(timer => clearTimeout(timer));
		};
	}, [requests]);
	useEffect(() => {
		const q = query(collection(db, 'medRequest'), where('isCurrentlyActive', '==', true));

		// Subscribe to real-time updates
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const updatedRequests = querySnapshot.docs.map(docSnapshot => ({
				id: docSnapshot.id,
				...docSnapshot.data(),
				loading: true,
			}));

			setRequests(updatedRequests);
		});

		// Cleanup function to unsubscribe from the listener when the component unmounts
		return () => unsubscribe();
	}, []);
	const deleteRequest = async (requestId) => {
		// Delete the request from the database
		const requestRef = doc(db, 'medRequest', requestId);
		await deleteDoc(requestRef);
		console.log(`Request ${requestId} deleted due to inactivity.`);

		// Optionally, update local state to remove the deleted request
		setRequests(requests.filter(request => request.id !== requestId));

		// Clear the timer from state
		const newTimers = { ...requestTimers };
		delete newTimers[requestId];
		setRequestTimers(newTimers);
	};

	// console.log(requests?.loading, 'the loading')
	const acceptRequest = async (requestId) => {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			console.log('No user logged in');
			return;
		}

		// Fetch current user's details from the user collection
		const userRef = doc(db, 'users', currentUser.uid);
		const userSnap = await getDoc(userRef);
		if (!userSnap.exists()) {
			console.log('User details not found');
			return;
		}

		const userData = userSnap.data();
		console.log(userData, "user data: ")

		// Update the medRequest document
		const requestRef = doc(db, 'medRequest', requestId);
		await updateDoc(requestRef, {
			acceptUserID: currentUser.uid,
			acceptUserLat: userData.location._lat, // Assuming these fields exist
			acceptUserLong: userData.location._long,
			pharmacyName:userData.pharmacyName,
			isCurrentlyActive: false
		});

		// Update local state if necessary, e.g., to remove the accepted request from the list
		setRequests(requests.filter(request => request.id !== requestId));
		// Clear the timer when a request is accepted to prevent deletion
		if (requestTimers[requestId]) {
			clearTimeout(requestTimers[requestId]);
			const newTimers = { ...requestTimers };
			delete newTimers[requestId];
			setRequestTimers(newTimers);
		}
		toast.info(('Medicine request responded'), {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
		});
	};

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
								<p onClick={(e) => {
									e.stopPropagation();
									acceptRequest(request.id);
								}} className="text-white cursor-pointer">{request.loading ? "Accept" : "Expired"}</p>
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
			<ToastContainer />
		</div>
	);


};

export default RequestHandle;
