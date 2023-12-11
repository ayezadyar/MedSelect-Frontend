// Popup.js
import React from 'react';

const Popup = ({ handleClose, children }) => {
	return (
		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 p-8 rounded shadow-md max-w-md w-full h-120 overflow-y-auto z-50">
			{/* Close button */}
			<button
				className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
				onClick={handleClose}
			>
				&times;
			</button>
			{/* Popup content */}
			<div className="flex items-center justify-center">
				<video className="w-full h-full" controls>
					{/* Replace 'video.mp4' with the actual path to your video file */}
					<source src="video.mp4" type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			</div>
		</div>
	);
};

export default Popup;
