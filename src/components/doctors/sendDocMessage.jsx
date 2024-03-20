import React, { useState } from 'react';

const SendDOCMessage = ({ onSend }) => {
	const [message, setMessage] = useState('');
	const [file, setFile] = useState(null); // State to manage the uploaded file

	const handleSubmit = (e) => {
		e.preventDefault();
		// Check if there is either a message or a file
		if (message.trim() || file) {
			onSend(message, file); // Send both message and file
			setMessage('');
			setFile(null); // Reset file state
		}
	};

	const handleFileChange = (e) => {
		setFile(e.target.files[0]); // Set the file to the first file if multiple files were selected
	};

	return (
		<form onSubmit={handleSubmit} className="send-message-form bg-gray-100 p-4 fixed bottom-0 w-full flex justify-between items-center">
			<input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Type a message..."
				className="input-field border rounded-full py-2 px-4 flex-grow mr-2"
			/>
			<input
				type="file"
				onChange={handleFileChange}
				className="file-input mr-2"
			/>
			<button type="submit" className="send-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
				Send
			</button>
		</form>
	);
};

export default SendDOCMessage;
