import React from 'react';
import { useNavigate } from 'react-router-dom'; // If you're using React Router for navigation
import { getAuth, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";


const LogOut = () => {
	const navigate = useNavigate(); // This will be used for navigation after logout
	const auth = getAuth(); // Initialize Firebase Auth

	const handleLogout = async () => {
		try {
			await signOut(auth); // Sign out the current user
			navigate('/'); // Navigate to the login page or wherever you wish after logging out
			// You might also want to update any global state or context to reflect that the user has logged out
		} catch (error) {
			console.error("Error signing out: ", error);
			// Handle errors here, such as displaying a notification to the user
		}
	};

	return (
		<div>
			<button onClick={handleLogout}>Log Out <FontAwesomeIcon className='ml-2' icon={faArrowRightFromBracket} /></button>
		</div>
	);
};

export default LogOut;
