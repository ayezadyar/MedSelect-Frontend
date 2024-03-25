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

    // Function to handle sharing the QR code image
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'QR Code',
                    text: 'Scan this QR code to visit MedSelect',
                    url: link,
                });
            } else {
                // Fallback for browsers that do not support Web Share API
                console.log('Web Share API not supported');
                // Provide alternative sharing options or display a message
            }
        } catch (error) {
            console.error('Error sharing:', error.message);
            // Handle errors, if any
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen ">
            {/* Prevent the click event from bubbling up when the QR code is clicked */}
            <div onClick={handleScreenClick} style={{ marginBottom: '20px' }}>
                <QRCode value={link} size={256} level={"H"} />
            </div>
            {/* Styling the Share button */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the screen click
                    handleShare(); // Call handleShare function to share QR code
                }}
                style={{
                    backgroundColor: '#4CAF50',
                    border: 'none',
                    color: 'white',
                    padding: '15px 32px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontSize: '16px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                }}
            >
                Share
            </button>
        </div>
    );
};

export default QRCodeDisplay;
