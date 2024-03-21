import React, { useState } from "react";
import { auth, db, storage } from "../../Firebase"; // Make sure storage is exported from Firebase config
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSend, FiPaperclip } from 'react-icons/fi';

const SendDocMessage = ({ scroll,user,otherUserID }) => {
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
		const fileRef = ref(storage, `chat/${file.name}`);
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
		if (!auth.currentUser) {
			toast.error("User not authenticated", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
			return;
		}

		if (message.trim() === "" && !file) {
			toast.error("Insert some text or a file", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
			return;
		}

		const { uid, email } = auth.currentUser;

		let fileUrl = await uploadFile(file);
		// Ensure fileUrl is not undefined or null before proceeding
		if (file && !fileUrl) {
			toast.error("File upload failed", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
			return;
		}

		await addDoc(collection(db, "chat"), {
			senderId: uid,
			receiverId: otherUserID,
			message: message,
			createdAt: serverTimestamp(), // use serverTimestamp for consistency
			participants: [uid, otherUserID], // use uid instead of user, if user is the user's uid
			imageUrl: fileUrl || null // explicitly set to null if there's no file
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
					placeholder="insert file / Add text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className="flex-1 mx-4 rounded-full py-2 px-4 outline-none focus:ring-2 focus:ring-[#517028]"
				/>
				<button type="submit" className="p-2 rounded-full bg-[#517028] text-white hover:bg-[#294a26] focus:outline-none focus:ring-2 focus:ring-[#294a26] focus:ring-offset-2">
					<FiSend className="text-xl" />
				</button>
			</form>
			<ToastContainer />
		</>
	);
};

export default SendDocMessage;
