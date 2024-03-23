import React from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure you have react-router-dom installed and setup
import QRCode from 'qrcode.react';

const QRCodeDisplay = () => {
	const navigate = useNavigate(); // Hook for navigation
	const link = "https://medselect.netlify.app/";

	// Navigate to the home page when clicking anywhere on the screen
	const handleScreenClick = () => {
		navigate('/');
	};

	return (
		<div className="flex justify-center items-center h-screen " onClick={handleScreenClick}>
			{/* Prevent the click event from bubbling up when the QR code is clicked */}
			<div onClick={(e) => e.stopPropagation()}>
				<QRCode value={link} size={256} level={"H"} />
			</div>
			{/* Styling the Share button */}
			<button

				onClick={(e) => {
					e.stopPropagation(); // Prevent triggering the screen click
					// Your share logic here
				}}
			>

			</button>
		</div>
	);
};

export default QRCodeDisplay;
