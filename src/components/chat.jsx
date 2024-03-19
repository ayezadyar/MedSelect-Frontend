import React, { useEffect, useRef, useState } from "react";
import { query, collection, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../Firebase";
import Message from "./Message";
import SendMessage from "./sendMessage";
import { FiSend, FiPaperclip, FiFileText } from 'react-icons/fi';
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

	useEffect(() => {
		if (scroll.current) {
			scroll.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<main className="flex flex-col h-screen">
			<div className="flex-grow overflow-auto p-4">
				<div className="messages-wrapper space-y-4 flex flex-col items-end">
					{messages.map((message) => (
						<div key={message.id} className="break-words max-w-xs">
							<Message message={message} />
							{message.fileUrl && (
								<a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
									{message.fileUrl.includes('.pdf') ? (
										// Show a default PDF icon if the URL includes ".pdf"
										// <img src="/pdf.svg" alt="PDF" className="rounded-lg shadow-md border h-20 w-20 object-cover" />
										<FiFileText className="h-10 w-10 ml-10" />
									) : (
										// Otherwise, attempt to display the image
										<img src={message.fileUrl} alt="Uploaded File" className="rounded-lg shadow-md border" />
									)}
								</a>
							)}
						</div>
					))}
				</div>
				<span ref={scroll}></span>
			</div>
			<div className="p-4 bg-gray-100">
				<SendMessage scroll={scroll} />
			</div>
		</main>
	);
};

export default ChatBox;
