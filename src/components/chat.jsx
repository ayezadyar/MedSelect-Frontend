import React, { useEffect, useRef, useState } from "react";
import { query, collection, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../Firebase";
import Message from "./Message";
import SendMessage from "./sendMessage";

const ChatBox = () => {
	const [messages, setMessages] = useState([]);
	const scroll = useRef();

	useEffect(() => {
		const q = query(
			collection(db, "messages"),
			orderBy("createdAt", "desc"),
			limit(50)
		);

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const fetchedMessages = [];
			querySnapshot.forEach((doc) => {
				fetchedMessages.push({ ...doc.data(), id: doc.id });
			});
			const sortedMessages = fetchedMessages.sort(
				(a, b) => a.createdAt.seconds - b.createdAt.seconds
			);
			setMessages(sortedMessages);
		});
		return () => unsubscribe();
	}, []);

	// Automatically scroll to the bottom on new messages
	useEffect(() => {
		if (scroll.current) {
			scroll.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<main className="chat-box">
			<div className="messages-wrapper">
				{messages.map((message) => (
					<div key={message.id}>
						<Message message={message} />
						{/* Display file if exists */}
						{message.fileUrl && (
							<a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
								<img src={message.fileUrl} alt="Uploaded File" style={{ maxWidth: '200px', maxHeight: '200px' }} />
							</a>
						)}
					</div>
				))}
			</div>
			<span ref={scroll}></span>
			<SendMessage scroll={scroll} />
		</main>
	);
};

export default ChatBox;
