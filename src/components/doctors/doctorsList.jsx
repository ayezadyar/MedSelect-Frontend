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
					// Filter out the current user from the list
					const filteredUsers = allUsers.filter((user) => user.uid !== auth.currentUser.uid);
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

	// Toggle expanded user description
	const toggleUserDescription = (userId) => {
		setExpandedUserId(expandedUserId === userId ? null : userId);
	};

	// Function to handle selection of a user
	const handleUserSelect = (selectedUserID) => {
		setSelectedUser(selectedUserID);
		navigate(`/docchat/${selectedUserID}`);
	};
	const [isNavOpen, setNavOpen] = useState(true);

	const toggleNav = () => {
		setNavOpen(!isNavOpen);
	};
	return (
		<div className="flex rounded-lg">
			{/* Side Navigation */}
			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

			{/* Main Content */}
			<div className={`flex flex-col flex-1 transition-margin duration-300 ${isNavOpen ? 'ml-64' : 'ml-0'}`}>
				{/* Burger Icon for toggling SideNav */}
				<button
					className={`absolute top-4 left-4 z-50 cursor-pointer text-2xl font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
					onClick={toggleNav}
				>
					{/* Assuming FontAwesomeIcon is correctly imported and faBars is available */}
					<FontAwesomeIcon icon={faBars} size="sm" />
				</button>

				<h1 className="text-center my-6 font-semibold text-2xl text-[#517028] mx-6">Doctors List</h1>
				<div className="overflow-auto px-6">
					{users.map((user) => (
						// Skip rendering the component if the user is the current user
						user.uid !== auth.currentUser.uid ? (
							<div
								key={user.uid}
								className="my-4 mr-4 ml-1 p-6 border-b border-gray-200 rounded-3xl bg-[#517028] w-full box-border shadow-lg"
								onClick={() => toggleUserDescription(user.uid)}
							>
								<div className="flex justify-between items-center">
									<h5 className="text-lg text-white cursor-pointer">{user.displayName}</h5>
									{/* Clicking the email will call handleUserSelect */}
									<p onClick={(e) => {
										e.stopPropagation(); // Prevent toggleUserDescription from being called
										handleUserSelect(user.uid);
									}} className="text-white cursor-pointer">{user.email}</p>
								</div>
								{expandedUserId === user.uid && (
									<div className="mt-2 text-white">
										<p>{user.description}</p>
									</div>
								)}
							</div>
						) : ''
					))}
				</div>
			</div>
		</div>
	);



};

export default DoctorList;
