import React from 'react';

const MessageDoc = ({ message }) => {
	// Determine message alignment and styling based on the sender
	const messageAlignmentClass = message.isSender ? 'items-end' : 'items-start';
	const messageBgColorClass = message.isSender ? 'bg-[#517028]' : 'bg-gray-300';
	const textColorClass = message.isSender ? 'text-white' : 'text-black';

	return (
		<div className={`flex flex-col ${messageAlignmentClass} my-2 mx-4`}>
			{/* Text Message */}
			{message.message && (
				<div className={`message-text ${messageBgColorClass} ${textColorClass} p-4 rounded-lg max-w-xs md:max-w-md lg:max-w-lg`}>
					{message.message}
				</div>
			)}

			{/* Image File */}
			{message.imageUrl && (
				<img src={message.imageUrl} alt="Uploaded File" className="rounded-lg mt-2" style={{ maxWidth: '50%', maxHeight: '200px', height: 'auto' }} />
			)}
		</div>
	);
};

export default MessageDoc;
