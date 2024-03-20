import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import { query, collection, orderBy, onSnapshot, limit, addDoc, where } from "firebase/firestore";
import { db, auth } from "../../Firebase"; // Adjust the import path as necessary
import MessageDoc from "../doctors/messageDoc"; // Adjust the import path as necessary
import SendDocMessage from "../doctors/sendDocMessage"; // Adjust the import path as necessary
import SideNav from "../sideNav"; // Adjust the import path as necessary
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const DocChat = () => {
	const [currentUserID, setCurrentUserID] = useState(null);
	const user = auth?.currentUser.uid
	const { otherUserID } = useParams(); // Get the other user's ID from the URL
	const [messages, setMessages] = useState([]);
	const scroll = useRef();
	const [isNavOpen, setIsNavOpen] = useState(false);

	const toggleNav = () => setIsNavOpen(!isNavOpen);
	console.log(user, "the user")

	useEffect(() => {
		// setCurrentUserID(user)
		// Check if both currentUserID and otherUserID are defined
		if (user && otherUserID) {
			const q = query(
				collection(db, "chat"),
				where("senderId", "in", [user, otherUserID]),
				where("receiverId", "in", [user, otherUserID]),
				orderBy("createdAt"),
				limit(50)
			);

			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const fetchedMessages = querySnapshot.docs.map(doc => ({
					...doc.data(),
					id: doc.id,
				})).sort((a, b) => a.createdAt - b.createdAt); // Adjust sorting if needed
				setMessages(fetchedMessages);
			});
			return () => unsubscribe();
		}
		console.log(user, otherUserID, 'both users')
	}, [user, otherUserID]);

	console.log(messages, "the messages")

	useEffect(() => {
		if (scroll.current) {
			scroll.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const sendMessage = async (messageContent) => {
		try {
			await addDoc(collection(db, "chat"), {
				senderId: user,
				receiverId: otherUserID,
				message: messageContent,
				createdAt: new Date()
			});
			console.log('dara sebt')
		} catch (error) {
			console.error("Error sending message: ", error);
		}
	};

	return (
		<div className="">

			{/* Message List */}
			<div className="flex flex-col justify-end mb-2">
				{messages.map((msg) => (
					<MessageDoc key={msg.id} message={{ ...msg, isSender: msg.senderId === user }} />
				))}
				<div ref={scroll}></div>
			</div>

			{/* Send Message Form */}
			<SendDocMessage onSend={sendMessage} />
		</div>
	);

};

export default DocChat;
