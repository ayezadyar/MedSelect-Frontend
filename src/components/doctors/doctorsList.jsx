import React, { useEffect, useState } from 'react';
import { db, auth } from '../../Firebase'; // Assuming you have a firebase.js file that initializes Firebase
import { collection, query, where, onSnapshot } from "firebase/firestore";
import DocChat from './docChat';
import { useNavigate } from 'react-router-dom';

const DoctorList = () => {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user
	const navigate = useNavigate();
	useEffect(() => {
		const unsubscribe = onSnapshot(query(collection(db, 'users')), (snapshot) => {
			const allUsers = snapshot.docs.map((doc) => ({
				uid: doc.id,
				...doc.data()
			}));
			const filteredUsers = allUsers.filter((user) => user.uid !== auth.currentUser.uid);
			setUsers(filteredUsers);
		});

		return () => unsubscribe(); // Cleanup function to unsubscribe from Firebase
	}, []);

	console.log('the users', users);

	// Function to handle selection of a user
	const handleUserSelect = (selectedUserID) => {
		setSelectedUser(selectedUserID);
		navigate(`/docchat/${selectedUserID}`);
	};

	return (
		<div>
			<h1>DoctorList</h1>
			<ul>
				{users.map((user) => (
					<li key={user.uid} onClick={() => handleUserSelect(user.uid)} className='cursor-pointer'> {/* onClick handler to select the user */}
						{user.displayName} - {user.email}
					</li>
				))}
			</ul>
		</div>
	);
};

export default DoctorList;
