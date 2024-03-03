// SideNav.js

import React from 'react';
import { Link } from 'react-router-dom';

const SideNav = ({ isNavOpen, toggleNav }) => (
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
			{/* <Link
				to="/community"
				className="block py-2 font-semibold hover:bg-[#294a26] hover:rounded hover:px-4 transition-all duration-300"
				onClick={toggleNav}
			>
				JOIN COMMUNITY
			</Link> */}
			<Link
				to="/contact"
				className="block py-2 font-semibold hover:bg-[#294a26] hover:rounded hover:px-4 transition-all duration-300"
				onClick={toggleNav}
			>
				CONTACT US
			</Link>
			{/* <Link
				to="/how-it-works"
				className="block py-2 font-semibold hover:bg-[#294a26] hover:rounded hover:px-4 transition-all duration-300"
				onClick={toggleNav}
			>
				HOW IT WORKS
			</Link> */}
		</div>
	</div>
);

export default SideNav;
