import React, { useEffect, useRef, useState } from "react";
import { query, collection, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../../Firebase";
import Message from "./Message";
import SendMessage from "./sendMessage";
import { FiSend, FiPaperclip, FiFileText } from 'react-icons/fi';
import SideNav from "../sideNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHippo, faMagnifyingGlass, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
const ChatBox = () => {
	const [messages, setMessages] = useState([]);
	const scroll = useRef();
	const [isNavOpen, setIsNavOpen] = useState(true);
	const toggleNav = () => setIsNavOpen(!isNavOpen);
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
											<video src={message.fileUrl} alt="Uploaded File" className="rounded-lg shadow-md "autoPlay />
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
