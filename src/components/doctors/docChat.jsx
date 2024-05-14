import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { query, collection, orderBy, onSnapshot, limit, addDoc, where, getFirestore } from "firebase/firestore";
import { auth } from "../../Firebase"; // Adjust the import path as necessary
import MessageDoc from "../doctors/messageDoc"; // Adjust the import path as necessary
import SendDocMessage from "../doctors/sendDocMessage"; // Adjust the import path as necessary
import SideNav from "../sideNav";
import StripeComponent from "../stripe/stripee";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { format, isToday } from 'date-fns';

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
						createdAt: doc.data().createdAt.toDate(), // Convert Firestore Timestamp to JavaScript Date
					}))
					.filter((msg) => msg.participants.includes(otherUserID));

				// Group messages by their creation date
				const groupedMessages = fetchedMessages.reduce((groups, message) => {
					const date = format(message.createdAt, 'yyyy-MM-dd');
					if (!groups[date]) {
						groups[date] = [];
					}
					groups[date].push(message);
					return groups;
				}, {});

				setMessages(groupedMessages);
			});

			return () => unsubscribe();
		}
	}, [user, otherUserID, db]);

	const [otherUserInfo, setOtherUserInfo] = useState('')
	useEffect(() => {
		const unsubscribe = onSnapshot(query(collection(db, 'users')), (snapshot) => {
			const allUsers = snapshot.docs.map((doc) => ({
				uid: doc.id,
				...doc.data()
			}));
			const filteredUsers = allUsers.filter((user) => user.uid === otherUserID);
			setOtherUserInfo(filteredUsers);
		});

		return () => unsubscribe(); // Cleanup function to unsubscribe from Firebase
	}, [otherUserID]);

	console.log('the users', otherUserInfo[0]?.email);

	const [isNavOpen, setIsNavOpen] = useState(false);
	const toggleNav = () => setIsNavOpen(!isNavOpen);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleEmailClick = () => {
		setIsModalOpen(true);
	};
	return (
		<>
			<div className={`flex h-screen ${isNavOpen ? 'pl-3' : 'pl-5'}`}> {/* Adjust the left padding based on SideNav state */}
				{otherUserInfo && (
					<div className="fixed font-semibold text-xl text-[#294a26] text-center py-2 w-full z-40 transition-all duration-500" style={{ left: isNavOpen ? '0px' : '0px', right: 0 }}>
						{/* Make banner responsive */}
						<button onClick={handleEmailClick}>
							{otherUserInfo[0]?.email}
						</button>
					</div>
				)}

				{isModalOpen && (
					<div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
						<div className="bg-white px-16 py-10 rounded-lg">
							<StripeComponent
								setIsModalOpen={setIsModalOpen}
							/>
							{/* <button onClick={() => setIsModalOpen(false)}>Close</button> */}
						</div>
					</div>
				)}

				{/* SideNav Component */}
				<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

				{/* Burger Icon for toggling SideNav */}
				<button
					className={`absolute top-4 left-4 z-50 cursor-pointer font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
					onClick={toggleNav}
				>
					<FontAwesomeIcon icon={faBars} size="lg" />
				</button>

				{/* Main Chat Content */}
				<main className={`flex flex-col flex-grow transition-all duration-500 ${isNavOpen ? 'pl-64' : 'pl-0'}`}>
					<div className="flex-grow overflow-auto p-4">
						{Object.entries(messages).map(([date, messagesForDate]) => (
							<div key={date} className="mb-4">
								<div className="text-center my-2">
									{/* Style as needed */}
									<hr className="border-t border-gray-200 mt-10" />
									<span className="relative top-[-10px] bg-white px-2">
										{isToday(new Date(date)) ? 'Today' : format(new Date(date), 'MMMM dd, yyyy')}
									</span>
								</div>
								{messagesForDate.map((msg) => (
									<div key={msg.id} className="flex flex-col justify-end mb-2">
										<MessageDoc message={{ ...msg, isSender: msg.senderId === user }} />
									</div>
								))}
							</div>
						))}
						<span ref={scroll}></span>
					</div>
					<div className="p-4 bg-gray-50 border-t border-gray-300">
						<SendDocMessage scroll={scroll} user={user} otherUserID={otherUserID} />
					</div>
				</main>
			</div>
		</>
	);


};

export default DocChat;