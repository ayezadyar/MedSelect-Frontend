// Popup.js
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
const Popup = ({ handleClose, children }) => {
	return (
		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ">
			{/* Background blur effect */}
			<div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-lg"></div>

			{/* Popup container */}
			<div className="p-7 rounded shadow-md max-w-screen-lg w-full h-120 overflow-y-auto relative">
				{/* Close button */}
				<button
					className="absolute top-4 right-3 text-white hover:text-white"
					onClick={handleClose}
				>
					<FontAwesomeIcon icon={faX}  />
				</button>
				{/* Popup content */}
				<div className="flex items-center justify-center rounded-lg">
					<video className="w-full h-full rounded-lg" controls>
						{/* Replace 'video.mp4' with the actual path to your video file */}
						<source src="video.mp4" type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				</div>
			</div>
		</div>
	);
};

export default Popup;
