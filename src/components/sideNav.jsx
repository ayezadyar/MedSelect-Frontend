// SideNav.js


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../Firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";;

const SideNav = ({ isNavOpen, toggleNav }) => {
	const auth = getAuth();
	const [currentUser, setCurrentUser] = useState('')
	useEffect(() => {
		// Listen for authentication state changes
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				// If there's a user, we set it
				setCurrentUser(user);
			} else {
				// User is signed out
				setCurrentUser(null);
			}
		});

		return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
	}, []);
	return (
		<div
			className={`fixed top-0 left-0 h-full bg-[#517028] w-64 text-white transform ${isNavOpen ? 'translate-x-0' : '-translate-x-full'
				} transition-transform duration-300 ease-in-out overflow-y-auto`}
		>
			<div className="p-4">
				<Link
					to="/"
					className="block py-2 font-semibold hover:bg-[#294a26] hover:rounded hover:px-4 transition-all duration-300"
					onClick={toggleNav}
					style={{ marginTop: isNavOpen ? "32px" : "0" }}
				>
					HOME
				</Link>
				<Link
					to="/about"
					className="block py-2 font-semibold hover:bg-[#294a26] hover:rounded hover:px-4 transition-all duration-300"
					onClick={toggleNav}
				>
					ABOUT US
				</Link>

				<Link
					to="/contact"
					className="block py-2 font-semibold hover:bg-[#294a26] hover:rounded hover:px-4 transition-all duration-300"
					onClick={toggleNav}
				>
					CONTACT US
				</Link>
				{currentUser &&
					<Link
						to="/doctorOnboard"
						className="block py-2 font-semibold hover:bg-[#294a26] hover:rounded hover:px-4 transition-all duration-300"
						onClick={toggleNav}
					>
						SWITCH TO DOCTOR
					</Link>
				}
			</div>
		</div>
	)
};

export default SideNav;
