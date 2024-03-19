import React, { useEffect, useRef, useState } from "react";
import { query, collection, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../Firebase";
import Message from "./Message";
import SendMessage from "./sendMessage";
import { FiSend, FiPaperclip, FiFileText } from 'react-icons/fi';
import SideNav from "./sideNav";
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
			<main className={`flex flex-col flex-grow ${isNavOpen ? 'pl-64' : 'pl-0'}`}>
				{/* Messages List */}
				<div className="flex-grow overflow-auto p-4">
					<div className="messages-wrapper space-y-4 flex flex-col items-end">
						{messages.map((message) => (
							<div key={message.id} className="break-words max-w-xs">
								<Message message={message} />
								{message.fileUrl && (
									<a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
										{message.fileUrl.includes('.pdf') ? (
											<FiFileText className="h-10 w-10 ml-10" />
										) : (
											<img src={message.fileUrl} alt="Uploaded File" className="rounded-lg shadow-md border" />
										)}
									</a>
								)}
							</div>
						))}
					</div>
					<span ref={scroll}></span>
				</div>
				{/* Send Message Component */}
				<div className={`p-4 bg-gray-100 `}>
					<SendMessage scroll={scroll} />
				</div>
			</main>
		</div>
	);


};

export default ChatBox;
