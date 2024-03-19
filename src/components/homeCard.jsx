// Card.js

import React from 'react';
import { Link } from 'react-router-dom';
const HomeCard = ({ imageSrc, altText, title, to }) => (
	<div className="w-full mb-4 relative overflow-hidden rounded-lg sm:w-1/3 lg:w-1/4 xl:w-1/5">
		<div className="bg-[#517028] shadow-md rounded p-2 h-48 text-white cursor-pointer hover:bg-[#294a26] transition-all duration-300 hover:scale-110">
			<Link to={to}>
				<div className="flex flex-col items-center">
					<img
						src={imageSrc}
						alt={altText}
						className="w-20 h-20 mx-auto my-6 object-cover rounded"
					/>
					<h2 className="text-sm sm:text-base font-semibold mb-2">{title}</h2>
				</div>
			</Link>
		</div>
		<div className="hidden absolute top-full left-0 w-full bg-white p-2 rounded shadow-md opacity-0 transition-opacity duration-300">
			{/* Additional content or functionality */}
		</div>
	</div>
);


export default HomeCard;
