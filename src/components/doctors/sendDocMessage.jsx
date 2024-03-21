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
		<form onSubmit={handleSubmit} className="flex items-center justify-between p-4 bg-gray-100 border-t border-gray-200">
			<label htmlFor="file-upload" className="file-upload-label mr-2">
				<FiPaperclip className="text-xl text-gray-600 hover:text-gray-800" />
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
				className="input-field border rounded-full py-2 px-4 flex-grow mr-2"
			/>
			<button type="submit" className="p-2 rounded-full bg-[#517028] text-white hover:bg-[#294a26] focus:outline-none focus:ring-2 focus:ring-[#294a26] focus:ring-offset-2">
				<FiSend className="text-xl" />
			</button>
		</form>
	);

};

export default SendDOCMessage;
