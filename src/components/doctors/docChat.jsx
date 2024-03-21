import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { query, collection, orderBy, onSnapshot, limit, addDoc, where, getFirestore } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { auth } from "../../Firebase"; // Adjust the import path as necessary
import MessageDoc from "../doctors/messageDoc"; // Adjust the import path as necessary
import SendDocMessage from "../doctors/sendDocMessage"; // Adjust the import path as necessary
import SideNav from "../sideNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import SendMessage from "../chat/sendMessage";

const DocChat = () => {

	const [progress, setProgress] = useState(0)

	const [messages, setMessages] = useState([]);
	const scroll = useRef();
	const user = auth.currentUser?.uid; // Make sure to handle authentication state correctly
	const { otherUserID } = useParams(); // Get the other user's ID from the URL
	const db = getFirestore();
	console.log(messages, "messages")
	useEffect(() => {
		setTimeout(() => {
			if (scroll.current) {
				scroll.current.scrollIntoView({ behavior: "smooth" });
			}
		}, 100); // Adjust delay as necessary
	}, [messages]);


	useEffect(() => {
		if (user && otherUserID) {
			const q = query(
				collection(db, "chat"),
				where("participants", "array-contains", user),
				orderBy("createdAt"),
				limit(50)
			);

			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const fetchedMessages = querySnapshot.docs
					.map((doc) => ({
						...doc.data(),
						id: doc.id,
					}))
					.filter((msg) => msg.participants.includes(otherUserID)) // Additional filter for messages between the two users
					.sort((a, b) => a.createdAt - b.createdAt);
				setMessages(fetchedMessages);
			});
			return () => unsubscribe();
		}
	}, [user, otherUserID, db]);

	

	const [isNavOpen, setIsNavOpen] = useState(false);
	const toggleNav = () => setIsNavOpen(!isNavOpen);

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
					<div className="flex flex-col justify-end ">
						{messages.map((msg) => (
							<div key={msg.id}
								className="flex flex-col justify-end ">
								<MessageDoc message={{ ...msg, isSender: msg.senderId === user }} />
								{/* Additional content based on your needs */}
							</div>
						))}
						<span ref={scroll}></span>
					</div>
				</div>
				{/* Send Message Component */}
				<div className={`p-4 bg-gray-50 border-t border-gray-300`}>
					<SendDocMessage  scroll={scroll} user={user} otherUserID={otherUserID}  />
					{/* <SendMessage scroll={scroll} chatCollection={"chat"} fileCollection={"chat"} /> */}
				</div>
			</main>
		</div>
	);
};

export default DocChat;