import React, { useState, useEffect } from 'react';
import SideNav from '../components/sideNav'; // Adjust this import to your project's file structure
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus, faEdit, faTrash, faToggleOn, faBell } from "@fortawesome/free-solid-svg-icons";
import { Howl } from 'howler';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../Firebase'; // Adjust this path to where you initialize Firebase
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
const AlarmClock = () => {
	const auth = getAuth();
	const [alarms, setAlarms] = useState([]);
	const [newAlarmTime, setNewAlarmTime] = useState('');
	const [newAlarmName, setNewAlarmName] = useState('');
	const [currentTime, setCurrentTime] = useState('');
	const [isNavOpen, setNavOpen] = useState(false);
	const [editAlarmIndex, setEditAlarmIndex] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);
	const sound = new Howl({
		src: ['/alarm.mp3'], // Make sure this path is correct for your project
	});
	useEffect(() => {
		// Listen for authentication state changes
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				// If there's a user, we set it
				setCurrentUser(user);
			} else {
				// User is signed out
				setCurrentUser(null);
			}
		});

		return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
	}, []);

	useEffect(() => {
		// Assuming you have a currentUser state that contains the uid of the logged-in user
		if (!currentUser) return;

		const q = query(collection(db, "alarms"), where("uid", "==", currentUser.uid));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const alarmsArray = [];
			querySnapshot.forEach((doc) => {
				alarmsArray.push({ id: doc.id, ...doc.data() });
			});
			setAlarms(alarmsArray);
		});

		// Cleanup function to unsubscribe from the listener when the component unmounts
		return () => unsubscribe();
	}, [currentUser]); // Dependency array, re-run the effect if currentUser changes

	useEffect(() => {
		const interval = setInterval(() => {
			const newTime = new Date().toLocaleTimeString('en-US', { hour12: true });
			setCurrentTime(newTime);

			alarms.forEach((alarm, index) => {
				if (formatTime(newTime) === alarm.time && alarm.isActive) {
					sound.play();
					toast.info((`Time for ${alarm.name}`), {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "light",
					});
					handleAlarmOff(index);
				}
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [alarms]);

	const formatTime = (time12h) => {
		const [time, modifier] = time12h.split(' ');
		let [hours, minutes] = time.split(':');
		if (hours === '12') {
			hours = '00';
		}
		if (modifier === 'PM' && hours !== '12') {
			hours = parseInt(hours, 10) + 12;
		}
		return `${hours}:${minutes}:00`;
	};

	const handleAlarmOff = async (index) => {
		const alarmId = alarms[index].id;
		await updateDoc(doc(db, "alarms", alarmId), { isActive: false });

		// Optionally, manually update state or fetch alarms again
	};


	const addNewAlarm = async () => {
		if (!newAlarmTime || !newAlarmName) {
			toast.error(("Please set a time and name for the alarm."), {
				position: "top-right",
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
		const formattedTime = formatTime(newAlarmTime + ' AM');
		const newAlarm = { name: newAlarmName, time: formattedTime, isActive: true, uid: currentUser.uid };

		if (editAlarmIndex !== null) {
			const alarmId = alarms[editAlarmIndex].id;
			await updateDoc(doc(db, "alarms", alarmId), newAlarm);
		} else {
			await addDoc(collection(db, "alarms"), newAlarm);
		}

		// Clear inputs and fetch alarms again
		setNewAlarmTime('');
		setNewAlarmName('');
		setEditAlarmIndex(null);
		// Optionally, fetch alarms again or manually update state
	};


	const toggleNav = () => {
		setNavOpen(!isNavOpen);
	};

	const editAlarm = (index) => {
		setEditAlarmIndex(index);
		setNewAlarmName(alarms[index].name);
		setNewAlarmTime(alarms[index].time);
	};

	const deleteAlarm = async (index) => {
		const alarmId = alarms[index].id;
		await deleteDoc(doc(db, "alarms", alarmId));

		// Optionally, fetch alarms again or manually update state
	};


	return (
		<div className="flex flex-col h-screen">
			{/* Side Navigation */}
			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

			{/* Main Content */}
			<div className={`flex-1 flex flex-col items-center justify-center ${isNavOpen ? 'ml-64' : ''}`}>
				{/* Navigation Toggle Button */}
				<button
					className={`absolute top-4 left-4 ${isNavOpen ? 'text-white' : 'text-black'}`}
					onClick={toggleNav}
				>
					<FontAwesomeIcon icon={faBars} size="lg" />
				</button>

				{/* Header */}
				<h1 className="text-2xl mb-2 font-bold text-[#294a26]">
					Dose Alarms <FontAwesomeIcon icon={faBell} />
				</h1>

				{/* Display Current Time */}
				<p className="text-lg mb-4 font-bold text-[#294a26]">
					Current Time: {currentTime}
				</p>

				{/* Input Fields for New Alarm Name and Time */}
				<div className="mb-4 flex items-center">
					<input
						type="text"
						placeholder="Alarm Name"
						value={newAlarmName}
						onChange={(e) => setNewAlarmName(e.target.value)}
						className="border p-3 rounded focus:outline-none mr-4"
					/>
					<input
						type="time"
						value={newAlarmTime}
						onChange={(e) => setNewAlarmTime(e.target.value)}
						className="border p-3 rounded focus:outline-none"
					/>
					{editAlarmIndex !== null ? (
						<button onClick={addNewAlarm} className="px-4 py-2 rounded bg-[#517028] hover:bg-[#294a26] text-white ml-4">
							<FontAwesomeIcon icon={faEdit} title="Edit" />
						</button>
					) : (
						<button onClick={addNewAlarm} className="px-4 py-2 rounded bg-[#517028] text-white ml-4 hover:bg-[#294a26]">
							<FontAwesomeIcon icon={faPlus} title="Add Alarm" />
						</button>
					)}
				</div>

				{/* Existing Alarms Table */}
				<div className="w-full max-w-md mb-4 text-center">
					<table className="w-full rounded-3xl">
						<thead>
							<tr>
								<th className="py-2 text-white bg-[#517028] rounded-tl-lg">Alarm Name</th>
								<th className="py-2 text-white bg-[#517028]">Alarm Time</th>
								<th className="py-2 text-white bg-[#517028] rounded-tr-lg">Actions</th>
							</tr>
						</thead>
						<tbody>
							{alarms.map((alarm, index) => (
								<React.Fragment key={index}>
									<tr className="text-black">
										<td className="p-2">
											{alarm.name}
										</td>
										<td className="p-2">
											{alarm.time ? new Date('1970-01-01T' + alarm.time).toLocaleTimeString('en-US', { hour12: true }) : ''}
										</td>
										<td className="p-2">
											<button onClick={() => editAlarm(index)} className="px-4 py-2 rounded text-[#294a26] mr-2" title="Edit">
												<FontAwesomeIcon icon={faEdit} style={{ color: '#294a26' }} />
											</button>
											<button onClick={() => deleteAlarm(index)} className="px-4 py-2 rounded text-[#294a26] mr-2" title="Delete">
												<FontAwesomeIcon icon={faTrash} style={{ color: '#294a26' }} />
											</button>
											{alarm.isActive && (
												<button
													onClick={() => handleAlarmOff(index)}
													className="px-4 py-2 rounded text-[#294a26]"
													title="Turn Off"
												>
													<FontAwesomeIcon icon={faToggleOn} style={{ color: '#294a26' }} />
												</button>
											)}
										</td>
									</tr>
									<tr>
										<td colSpan="3" className="border-b border-[#517028]"></td>
									</tr>
								</React.Fragment>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<ToastContainer />
		</div>

	);


};

export default AlarmClock;