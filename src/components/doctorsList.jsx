import React, { useEffect, useState } from 'react';
import { db, auth } from '../Firebase'; // Assuming you have a firebase.js file that initializes Firebase

const DoctorList = () => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const unsubscribe = db.collection('users').onSnapshot((snapshot) => {
			const allUsers = snapshot.docs.map((doc) => doc.data());
			const filteredUsers = allUsers.filter((user) => user.uid !== auth.currentUser.uid);
			setUsers(filteredUsers);
		});

		return () => unsubscribe(); // Cleanup function to unsubscribe from Firebase
	}, []);
	console.log('the users',users)
	return (
		<div>
			<h1>DoctorList</h1>
			<ul>
				{users.map((user) => (
					<li key={user.uid}>
						{user.displayName} - {user.email}
					</li>
				))}
			</ul>
		</div>
	);
};

export default DoctorList;
