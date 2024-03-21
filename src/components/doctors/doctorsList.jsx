import React, { useState, useEffect } from 'react';
import { db, auth } from '../../Firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'; // Importing icons

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

	return (
		<div className="container" style={{ backgroundColor: '#517028' }}>
			<h1 className="text-center my-4" style={{ color: '#fff' }}>Doctor List</h1>
			{users.map((user) => (
				<div
					key={user.uid}
					className="cursor-pointer p-4 border-b border-white"
					style={{ backgroundColor: expandedUserId === user.uid ? '#39571B' : 'transparent' }}
				>
					<div className="flex justify-between items-center">
						<div>
							<h5 className="text-white">{user.displayName}</h5>
							{/* Email with onClick to navigate */}
							<p className="text-white" onClick={() => handleUserSelect(user.uid)}>{user.email}</p>
						</div>
						<div>
							{/* Icon toggles based on expanded state */}
							{expandedUserId === user.uid
								? <MdArrowDropUp className="text-white" onClick={() => toggleUserDescription(user.uid)} />
								: <MdArrowDropDown className="text-white" onClick={() => toggleUserDescription(user.uid)} />}
						</div>
					</div>
					{expandedUserId === user.uid && (
						<div className="mt-2">
							<p className="text-white">{user.description}</p>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default DoctorList;
