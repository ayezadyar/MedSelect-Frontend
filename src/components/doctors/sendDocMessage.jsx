import React, { useState } from 'react';

const SendDOCMessage = ({ onSend }) => {
	const [message, setMessage] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (message.trim()) {
			onSend(message);
			setMessage('');
		}
	};

	return (
		<form onSubmit={handleSubmit} className="send-message-form bg-gray-100 p-4 fixed bottom-0 w-full flex justify-between items-center">
			<input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Type a message..."
				className="input-field border rounded-full py-2 px-4 flex-grow"
			/>
			<button type="submit" className="send-button ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
				Send
			</button>
		</form>
	);
};

export default SendDOCMessage;
