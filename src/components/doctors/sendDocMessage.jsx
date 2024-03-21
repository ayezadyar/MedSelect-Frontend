import React, { useState } from 'react';
import { FiPaperclip, FiSend } from 'react-icons/fi';
const SendDOCMessage = ({ onSend, scroll }) => {
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
		scroll.current.scrollIntoView({ behavior: "smooth" });
	};

	const handleFileChange = (e) => {
		setFile(e.target.files[0]); // Set the file to the first file if multiple files were selected
	};




	return (
		<form onSubmit={handleSubmit} className="">
			<label htmlFor="file-upload" className="">
				<FiPaperclip className="" />
				<input
					id="file-upload"
					type="file"
					onChange={handleFileChange}
					className="hidden"
				/>
			</label>
			<input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Type a message..."
				className=""
			/>
			<button type="submit" className="">
				<FiSend className="text-xl" />
			</button>
		</form>
	);

};

export default SendDOCMessage;
