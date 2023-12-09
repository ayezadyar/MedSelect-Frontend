import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function About() {
	const [isNavOpen, setNavOpen] = useState(false);

	const toggleNav = () => {
		setNavOpen(!isNavOpen);
	};

	return (
		<div className="flex">
			{/* Side Navigation */}
			<div
				className={`fixed top-0 left-0 h-full bg-teal-500 w-64 text-white transform ${isNavOpen ? 'translate-x-0' : '-translate-x-full'
					} transition-transform duration-300 ease-in-out overflow-y-auto`}
			>
				<div className="p-4">
					<Link
						to="/"
						className="block py-2 hover:bg-teal-700 transition-all duration-300"
						onClick={toggleNav}
						style={{ marginTop: isNavOpen ? '22px' : '0' }}
					>
						HOME
					</Link>
					<Link
						to="/about"
						className="block py-2 hover:bg-teal-700 transition-all duration-300"
						onClick={toggleNav}
					>
						ABOUT US
					</Link>
					<Link
						to="/community"
						className="block py-2 hover:bg-teal-700 transition-all duration-300"
						onClick={toggleNav}
					>
						JOIN COMMUNITY
					</Link>
					<Link
						to="/contact"
						className="block py-2 hover:bg-teal-700 transition-all duration-300"
						onClick={toggleNav}
					>
						CONTACT US
					</Link>
					<Link
						to="/how-it-works"
						className="block py-2 hover:bg-teal-700 transition-all duration-300"
						onClick={toggleNav}
					>
						HOW IT WORKS
					</Link>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-col flex-1 justify-center items-center min-h-screen">
				{/* Burger Icon */}
				<div
					className={`absolute top-4 left-4 cursor-pointer ${isNavOpen ? 'text-white' : 'text-black'
						} font-bold`}
					onClick={toggleNav}
				>
					<div className="w-6 h-px bg-current mb-1"></div>
					<div className="w-6 h-px bg-current mb-1"></div>
					<div className="w-6 h-px bg-current"></div>
				</div>
			</div>
		</div>

	);
}
