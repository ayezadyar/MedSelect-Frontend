import React from "react";
import { auth } from "../../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Message = ({ message }) => {
	const [user] = useAuthState(auth);

	return (
		<div
			className={`chat-bubble ${message.uid === user.uid ? "chat-bubble__right" : ""}`}
		>
			<div className={message.uid === user.uid ? "chat-bubble__right" : ""}>
				<p className="text-right text-[#517028] font-semibold text-sm mb-1">{message.name}</p>
				<p className="user-message text-gray-800 text-base">{message.text}</p>
			</div>
		</div>
	);
};

export default Message;
