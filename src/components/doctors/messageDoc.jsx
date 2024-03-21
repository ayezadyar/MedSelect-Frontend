import React from 'react';
import { FiFileText } from 'react-icons/fi';

const MessageDoc = ({ message }) => {
	// Determine message alignment and styling based on the sender
	const messageAlignmentClass = message.isSender ? 'items-end' : 'items-start';
	const messageBgColorClass = message.isSender ? 'bg-[#517028]' : 'bg-gray-300';
	const textColorClass = message.isSender ? 'text-white' : 'text-black';
	
	function getFileNameFromUrl(url) {
		const fileName = url.substring(url.lastIndexOf('/') + 1);
		return fileName;
	}

	function getFileNameWithoutExtension(fileName) {
		// Find the index of the underscore
		const underscoreIndex = fileName.indexOf('_');

		// If underscore is found, extract the substring before it
		if (underscoreIndex !== -1) {
			return fileName.substring(underscoreIndex + 1).split('.')[0];
		}

		// If underscore is not found, return the original fileName
		return fileName;
	}

	return (
		<div className={`flex flex-col ${messageAlignmentClass} my-2 mx-4`}>
			{/* Text Message */}
			{message.message && (
				<div className={`message-text ${messageBgColorClass} ${textColorClass} p-4 rounded-lg max-w-xs md:max-w-md lg:max-w-lg`}>
					{message.message}
				</div>
			)}

			{message.imageUrl && (
				<a href={message.imageUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
					{message.imageUrl.includes('.pdf') ? (
						<div className="flex items-center">
							<FiFileText className="h-10 w-10 text-gray-700" />
							<div className="ml-2">
								{getFileNameFromUrl(decodeURIComponent(getFileNameWithoutExtension(message.imageUrl)))}
							</div>
						</div>
					) : message.imageUrl.includes('.mp4') || message.imageUrl.includes('.webm') || message.imageUrl.includes('.mkv') ? (
						<video src={message.imageUrl} alt="Uploaded File" className="rounded-lg shadow-md" autoPlay />
					) : (
						<img src={message.imageUrl} alt="Uploaded File" className="rounded-lg shadow-md" style={{ width: '200px', height: 'auto' }} />
					)}
				</a>
			)}


		</div>
	);
};

export default MessageDoc;
