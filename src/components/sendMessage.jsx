import React, { useState } from "react";
import { auth, db } from "../Firebase";
import { storage } from "../Firebase"; // Assuming you export storage from your Firebase config file
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const SendMessage = ({ scroll }) => {
	const [message, setMessage] = useState("");
	const [file, setFile] = useState(null);
	const auth = getAuth();

	const handleFileChange = (e) => {
		setFile(e.target.files[0]); // Assuming single file upload; adjust if multiple
	};

	const uploadFile = async (file) => {
		if (!file) return null;
		const fileRef = ref(storage, `files/${file.name}`);
		const uploadTask = uploadBytesResumable(fileRef, file);

		return new Promise((resolve, reject) => {
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					// Handle progress
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + progress + '% done');
				},
				(error) => {
					// Handle unsuccessful uploads
					console.log(error);
					reject(error);
				},
				() => {
					// Handle successful uploads on complete
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						resolve(downloadURL);
					});
				}
			);
		});
	};

	const sendMessage = async (event) => {
		event.preventDefault();
		if (message.trim() === "" && !file) {
			alert("Enter valid message or select a file to send");
			return;
		}

		const { uid, email, photoURL } = auth.currentUser;

		let fileUrl = await uploadFile(file);

		await addDoc(collection(db, "messages"), {
			text: message,
			name: email,
			fileUrl,
			createdAt: serverTimestamp(),
			uid,
		});

		console.log(uid, "the uid");
		setMessage("");
		setFile(null); // Reset file input
		scroll.current.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<form onSubmit={(event) => sendMessage(event)} className="send-message">
			<label htmlFor="messageInput" hidden>
				Enter Message
			</label>
			<input
				id="messageInput"
				name="messageInput"
				type="text"
				placeholder="Type message..."
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<input
				type="file"
				onChange={handleFileChange}
			/>
			<button type="submit">Send</button>
		</form>
	);
};

export default SendMessage;
