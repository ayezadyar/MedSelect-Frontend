import React, { useEffect, useRef, useState } from "react";
import { query, collection, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../../Firebase";
import Message from "./Message";
import SendMessage from "./sendMessage";
import { FiFileText } from 'react-icons/fi';
import SideNav from "../sideNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { format, isToday, isSameDay } from 'date-fns'; // Import functions for date formatting and comparison

const ChatBox = () => {
	const [messages, setMessages] = useState([]); // State to hold messages
	const scroll = useRef(); // Reference to scroll to the bottom of messages
	const [isNavOpen, setIsNavOpen] = useState(true); // State to manage navigation visibility

	const toggleNav = () => setIsNavOpen(!isNavOpen); // Function to toggle navigation visibility

	useEffect(() => {
		const q = query(
			collection(db, "messages"),
			orderBy("createdAt", "desc"),
			limit(50)
		);

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const fetchedMessages = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				// Ensure createdAt is an object with a 'seconds' property
				if (data.createdAt && typeof data.createdAt.seconds === 'number') {
					fetchedMessages.push({ ...data, id: doc.id });
				}
			});

			const sortedMessages = fetchedMessages.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
			setMessages(sortedMessages);
		});

		return () => unsubscribe();
	}, []);


	useEffect(() => {
		if (scroll.current) {
			scroll.current.scrollIntoView({ behavior: "smooth" }); // Scroll to the bottom of messages
		}
	}, [messages]);

	function getFileNameFromUrl(url) {
		const fileName = url.substring(url.lastIndexOf('/') + 1);
		return fileName;
	}

	function getFileNameWithoutExtension(fileName) {
		const parts = fileName.split('.');
		const baseName = parts.slice(0, -1).join('.');
		return baseName;
	}
	
	const toDate = (timestamp) => {
		return timestamp ? new Date(timestamp.seconds * 1000) : new Date();
	};
	function formatDate(timestamp) {
		const date = timestamp.toDate();
		return date.toLocaleDateString();
	}

	// Transform messages into a grouped structure
	const groupMessagesByDate = (messages) => {
		return messages.reduce((acc, message) => {
			// Convert Firestore timestamp to Date object
			const date = toDate(message.createdAt).toDateString();
			if (!acc[date]) {
				acc[date] = [];
			}
			acc[date].push(message);
			return acc;
		}, {});
	};

	const messagesGroupedByDate = groupMessagesByDate(messages);
	// Now, when rendering, iterate over `groupedMessages` to display each group

	return (
		<div className="flex h-screen">
			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
			<button
				className={`absolute top-4 left-4 z-50 cursor-pointer font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
				onClick={toggleNav}
			>
				<FontAwesomeIcon icon={faBars} size="lg" />
			</button>
			<main className={`flex flex-col flex-grow transition-padding duration-500 ${isNavOpen ? 'pl-64' : 'pl-0'}`}>
				<div className="flex-grow overflow-auto p-4">
					{Object.keys(messagesGroupedByDate).map((date) => (
						<div key={date}>
							{/* Header for the date */}
							<div className="text-center my-4 relative">
								<hr className="border-t border-gray-200" />
								<span className="absolute left-1/2 top-1/2 bg-white px-2 -translate-x-1/2 -translate-y-1/2 transform">
									{isToday(new Date(date)) ? 'Today' : format(new Date(date), 'MMMM dd, yyyy')}
								</span>
							</div>


							{/* Messages for the date */}
							<div className="space-y-4 flex flex-col items-end">
								{messagesGroupedByDate[date].map((message) => (
									<div key={message.id} className="break-words max-w-xs p-4 mb-4 rounded shadow-md border border-gray-300 bg-white">
										<Message message={message} />
										{message.fileUrl && (
											<a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
												{message.fileUrl.includes('.pdf') ? (
													<div className="flex items-center">
														<FiFileText className="h-10 w-10 text-gray-700" />
														<div className="ml-2">
															{getFileNameFromUrl(decodeURIComponent(getFileNameWithoutExtension(message.fileUrl)))}
														</div>
													</div>
												) : message.fileUrl.includes('.mp4') || message.fileUrl.includes('.webm') || message.fileUrl.includes('.mkv') ? (
													<video src={message.fileUrl} alt="Uploaded File" className="rounded-lg shadow-md" autoPlay muted loop />
												) : (
													<img src={message.fileUrl} alt="Uploaded File" className="rounded-lg shadow-md" />
												)}
											</a>
										)}
									</div>
								))}
							</div>
						</div>
					))}
					<span ref={scroll}></span>
				</div>
				<div className="p-4 bg-gray-50 border-t border-gray-300">
					<SendMessage scroll={scroll} />
				</div>
			</main>
		</div>
	);
}
export default ChatBox;
