import React, { useState, useEffect } from 'react';
import { db, auth } from '../../Firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'; // Importing icons
import SideNav from '../sideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const DoctorList = () => {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);

	const [expandedUserId, setExpandedUserId] = useState(null); // Track expanded user
	const navigate = useNavigate();

	useEffect(() => {
		let isSubscribed = true; // Track if component is mounted

		const fetchUsers = async () => {
			if (auth.currentUser) {
				const unsubscribe = onSnapshot(query(collection(db, 'users')), (snapshot) => {
					if (!isSubscribed) return; // Prevent state update if component unmounted
					const allUsers = snapshot.docs.map((doc) => ({
						uid: doc.id,
						...doc.data(),
					}));
					// Filter out the current user from the list if not a doctor
					let filteredUsers;
					filteredUsers = allUsers.filter((user) => user.uid === auth.currentUser.uid)
					console.log(auth.currentUser.uid, "doc var")

					if (filteredUsers[0].isDoctor) {
						filteredUsers = allUsers.filter((user) => user.uid !== auth.currentUser.uid);
					} else {
						filteredUsers = allUsers.filter((user) =>
							user.uid !== auth.currentUser.uid && user.isDoctor === true
						);
					}
					setUsers(filteredUsers);
				});

				return () => unsubscribe();
			}
		};

		fetchUsers();

		return () => {
			isSubscribed = false; // Set to false when component unmounts
		};
	}, []);
	console.log(users, "users in list")
	// Function to handle selection of a user
	const handleUserSelect = (selectedUserID) => {
		setSelectedUser(selectedUserID);
		navigate(`/docchat/${selectedUserID}`);
	};

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

				<h1 className="text-center my-6 font-semibold text-xl lg:text-2xl text-[#294a26] px-6">Doctors List</h1>
				<div className="overflow-auto px-6">
					{users.map((user) => (
						user.uid !== auth.currentUser.uid && (
							<div
								key={user.uid}
								className="my-4 mx-1 lg:mx-4 p-6 border-b border-gray-200 rounded-3xl bg-[#517028] shadow-lg cursor-pointer hover:shadow-2xl transition-shadow duration-300 ease-in-out"
								onClick={() => toggleUserDescription(user.uid)}
							>
								<div className="flex justify-between items-center">
									<h5 className="text-lg text-white">{user.displayName}</h5>
									<p onClick={(e) => {
										e.stopPropagation();
										handleUserSelect(user.uid);
									}} className="text-white cursor-pointer">{user.email}</p>
								</div>
								{expandedUserId === user.uid && user?.licenseNumber && (
									<div className="mt-2 text-white">
										<p className='font-semibold'>{`License number : `}<span className='font-normal font-sans'>{`${user?.licenseNumber}`}</span></p>
										<p className='font-semibold'>{`Domain : `}<span className='font-normal font-sans'>{`${user?.domain}`}</span></p>
										<p className='font-semibold'>{`Year of experience : `}<span className='font-normal font-sans'>{`${user?.experience}`}</span></p>
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

export default DoctorList;
