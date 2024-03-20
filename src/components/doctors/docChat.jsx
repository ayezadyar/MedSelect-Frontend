import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { query, collection, orderBy, onSnapshot, limit, addDoc, where, getFirestore } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../../Firebase"; // Adjust the import path as necessary
import MessageDoc from "../doctors/messageDoc"; // Adjust the import path as necessary
import SendDocMessage from "../doctors/sendDocMessage"; // Adjust the import path as necessary

const DocChat = () => {
	const [messages, setMessages] = useState([]);
	const scroll = useRef();
	const user = auth.currentUser?.uid; // Make sure to handle authentication state correctly
	const { otherUserID } = useParams(); // Get the other user's ID from the URL
	const db = getFirestore();
	console.log(messages,"messages")

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

	useEffect(() => {
		if (scroll.current) {
			scroll.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const sendMessage = async (messageContent, file = null) => {
		const messageData = {
			senderId: user,
			receiverId: otherUserID,
			message: messageContent,
			createdAt: new Date(),
			participants: [user, otherUserID],
			imageUrl: null, // Default to null, update if file is uploaded
		};

		// If there's a file, upload it first
		if (file) {
			const storage = getStorage();
			const fileRef = storageRef(storage, `chat/${new Date().getTime()}_${file.name}`);
			const fileSnapshot = await uploadBytes(fileRef, file);
			const imageUrl = await getDownloadURL(fileSnapshot.ref);
			messageData.imageUrl = imageUrl;
		}

		// Add the message to Firestore
		await addDoc(collection(db, "chat"), messageData);
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
