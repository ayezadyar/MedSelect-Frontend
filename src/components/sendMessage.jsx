import React, { useState } from "react";
import { auth, db } from "../Firebase";
import { storage } from "../Firebase"; // Assuming you export storage from your Firebase config file
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { FiSend, FiPaperclip } from 'react-icons/fi';

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
		<form onSubmit={(event) => sendMessage(event)} className="flex items-center justify-between p-4 bg-gray-100 border-t border-gray-200">
			<label htmlFor="fileInput" className="cursor-pointer">
				<FiPaperclip className="text-xl text-gray-600 hover:text-gray-800" />
				<input
					id="fileInput"
					type="file"
					onChange={handleFileChange}
					className="hidden"
				/>
			</label>
			<input
				id="messageInput"
				name="messageInput"
				type="text"
				placeholder="Type message..."
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				className="flex-1 mx-4 rounded-full py-2 px-4 outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button type="submit" className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
				<FiSend className="text-xl" />
			</button>
		</form>
	);
};

export default SendMessage;
