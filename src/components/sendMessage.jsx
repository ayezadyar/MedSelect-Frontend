import React, { useState } from "react";
import { auth, db, storage } from "../Firebase"; // Make sure storage is exported from Firebase config
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { FiSend, FiPaperclip } from 'react-icons/fi';

const SendMessage = ({ scroll }) => {
	const [message, setMessage] = useState("");
	const [file, setFile] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const auth = getAuth();

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setFile({
				rawFile: selectedFile,
				name: selectedFile.name,
				size: selectedFile.size,
				preview: selectedFile.type.startsWith("image/") ? URL.createObjectURL(selectedFile) : null,
			}); // Include file preview if it's an image
		}
	};

	const uploadFile = async (file) => {
		if (!file) return null;
		setIsUploading(true);
		const fileRef = ref(storage, `files/${file.name}`);
		const uploadTask = uploadBytesResumable(fileRef, file.rawFile);

		return new Promise((resolve, reject) => {
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setUploadProgress(progress);
				},
				(error) => {
					console.log(error);
					reject(error);
					setIsUploading(false);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						resolve(downloadURL);
						setIsUploading(false);
					});
				}
			);
		});
	};

	const sendMessage = async (event) => {
		event.preventDefault();
		if (message.trim() === "" && !file) {
			alert("Enter a valid message or select a file to send");
			return;
		}

		const { uid, email } = auth.currentUser;

		let fileUrl = await uploadFile(file);

		await addDoc(collection(db, "messages"), {
			text: message,
			name: email,
			fileUrl,
			createdAt: serverTimestamp(),
			uid,
		});

		setMessage("");
		setFile(null); // Reset file input
		scroll.current.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<>
			{isUploading && file && (
				<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-5 rounded-lg flex flex-col items-center">
						<div className="mb-2">Uploading: {file.name} ({(file.size / 1024).toFixed(2)} KB)</div>
						{file.preview && <img src={file.preview} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '10px' }} />}
						<progress value={uploadProgress} max="100" />
						<div>{Math.round(uploadProgress)}%</div>
					</div>
				</div>
			)}
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
		</>
	);
};

export default SendMessage;
