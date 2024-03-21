import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { query, collection, orderBy, onSnapshot, limit, addDoc, where, getFirestore } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { auth } from "../../Firebase"; // Adjust the import path as necessary
import MessageDoc from "../doctors/messageDoc"; // Adjust the import path as necessary
import SendDocMessage from "../doctors/sendDocMessage"; // Adjust the import path as necessary

const DocChat = () => {
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

			// Create a reference for the upload task
			const uploadTask = uploadBytesResumable(fileRef, file);

			// Listen for state changes, errors, and completion of the upload.
			uploadTask.on('state_changed',
				(snapshot) => {
					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + progress + '% done');
					// Update your progress bar here
				},
				(error) => {
					// Handle unsuccessful uploads
					console.error(error);
				},
				() => {
					// Handle successful uploads on complete
					console.log('Upload successful');
					// Get download URL and update messageData with the imageUrl
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						messageData.imageUrl = downloadURL;
						// Add the message to Firestore
						addDoc(collection(db, "chat"), messageData);
					});
				}
			);
		} else {
			// If no file, directly add the message to Firestore
			await addDoc(collection(db, "chat"), messageData);
		}
	};

	return (
		<>
		
			<div className="flex flex-col justify-end mb-2 pb-16">
				{/* Message List */}
				<div className="flex flex-col justify-end mb-2">
					{messages.map((msg) => (
						<MessageDoc key={msg.id} message={{ ...msg, isSender: msg.senderId === user }} />
					))}
					<div ref={scroll}></div>
				</div>

				{/* Send Message Form */}
				<SendDocMessage onSend={sendMessage}
					scroll={scroll}
				/>
			</div>
		</>
	);
};

export default DocChat;
