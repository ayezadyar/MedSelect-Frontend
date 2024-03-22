import React, { useEffect, useRef, useState } from "react";
import { query, collection, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../../Firebase";
import Message from "./Message";
import SendMessage from "./sendMessage";
import { FiFileText } from 'react-icons/fi';
import SideNav from "../sideNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const ChatBox = () => {
	const [messages, setMessages] = useState([]); // State to hold messages
	const scroll = useRef(); // Reference to scroll to the bottom of messages
	const [isNavOpen, setIsNavOpen] = useState(true); // State to manage navigation visibility

	const toggleNav = () => setIsNavOpen(!isNavOpen); // Function to toggle navigation visibility

	useEffect(() => {
		const q = query(
			collection(db, "messages"), // Collection reference from Firebase
			orderBy("createdAt", "desc"), // Order messages by createdAt in descending order
			limit(50) // Limit messages to 50
		);

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const fetchedMessages = []; // Array to hold fetched messages
			querySnapshot.forEach((doc) => {
				fetchedMessages.push({ ...doc.data(), id: doc.id }); // Push each message into the array
			});
			const sortedMessages = fetchedMessages.sort(
				(a, b) => a.createdAt.seconds - b.createdAt.seconds
			); // Sort messages by createdAt
			setMessages(sortedMessages); // Set messages state
		});
		return () => unsubscribe(); // Cleanup function to unsubscribe from Firebase
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

	return (
		<div className="flex h-screen">
			{/* SideNav Component */}
			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

			{/* Burger Icon for toggling SideNav */}
			<button
				className={`absolute top-4 left-4 z-50 cursor-pointer font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
				onClick={toggleNav}
			>
				<FontAwesomeIcon icon={faBars} size="lg" />
			</button>

			{/* Main Chat Content, adjusting padding based on SideNav state */}
			<main className={`flex flex-col flex-grow transition-padding duration-500 ${isNavOpen ? 'pl-64' : 'pl-0'}`}>
				{/* Messages List */}
				<div className="flex-grow overflow-auto p-4">
					<div className="messages-wrapper space-y-4 flex flex-col items-end">
						{messages.map((message) => (
							<div key={message.id}
								className="break-words max-w-xs p-4 mb-4 rounded shadow-md border border-gray-300 bg-white">
								<Message message={message} /> {/* Message Component */}
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
											<video src={message.fileUrl} alt="Uploaded File" className="rounded-lg shadow-md " autoPlay />
										) : (
											<img src={message.fileUrl} alt="Uploaded File" className="rounded-lg shadow-md " />
										)}
									</a>
								)}
							</div>
						))}
					</div>
					<span ref={scroll}></span>
				</div>
				{/* Send Message Component */}
				<div className={`p-4 bg-gray-50 border-t border-gray-300`}>
					<SendMessage scroll={scroll} />
				</div>
			</main>
		</div>
	);

};

export default ChatBox;
