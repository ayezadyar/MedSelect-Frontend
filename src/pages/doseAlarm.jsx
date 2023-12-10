import React, { useState, useEffect } from 'react';
import SideNav from '../components/sideNav'; // Adjust this import to your project's file structure
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus, faEdit, faTrash, faToggleOn, faBell } from "@fortawesome/free-solid-svg-icons";
import { Howl } from 'howler';

const AlarmClock = () => {
	const [alarms, setAlarms] = useState([]);
	const [newAlarmTime, setNewAlarmTime] = useState('');
	const [newAlarmName, setNewAlarmName] = useState('');
	const [currentTime, setCurrentTime] = useState('');
	const [isNavOpen, setNavOpen] = useState(false);
	const [editAlarmIndex, setEditAlarmIndex] = useState(null);

	const sound = new Howl({
		src: ['/alarm.mp3'], // Make sure this path is correct for your project
	});

	useEffect(() => {
		const interval = setInterval(() => {
			const newTime = new Date().toLocaleTimeString('en-US', { hour12: true });
			setCurrentTime(newTime);

			alarms.forEach((alarm, index) => {
				if (formatTime(newTime) === alarm.time && alarm.isActive) {
					sound.play();
					alert(`Time for ${alarm.name}`);
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

	const handleAlarmOff = (index) => {
		const updatedAlarms = alarms.map((alarm, i) => (
			i === index ? { ...alarm, isActive: false } : alarm
		));
		setAlarms(updatedAlarms);
	};

	const addNewAlarm = () => {
		if (!newAlarmTime || !newAlarmName) {
			alert("Please set a time and name for the alarm.");
			return;
		}
		const formattedTime = formatTime(newAlarmTime + ' AM');
		if (editAlarmIndex !== null) {
			// If editing, update the existing alarm
			const updatedAlarms = [...alarms];
			updatedAlarms[editAlarmIndex] = { name: newAlarmName, time: formattedTime, isActive: true };
			setAlarms(updatedAlarms);
			setEditAlarmIndex(null);
		} else {
			// If not editing, add a new alarm
			setAlarms([...alarms, { name: newAlarmName, time: formattedTime, isActive: true }]);
		}
		setNewAlarmTime('');
		setNewAlarmName('');
	};

	const toggleNav = () => {
		setNavOpen(!isNavOpen);
	};

	const editAlarm = (index) => {
		setEditAlarmIndex(index);
		setNewAlarmName(alarms[index].name);
		setNewAlarmTime(alarms[index].time);
	};

	const deleteAlarm = (index) => {
		const updatedAlarms = [...alarms];
		updatedAlarms.splice(index, 1);
		setAlarms(updatedAlarms);
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
					Dose Alarms <FontAwesomeIcon icon={faBell}/>
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
						<button onClick={addNewAlarm} className="px-4 py-2 rounded bg-blue-600 text-white ml-4">
							<FontAwesomeIcon icon={faEdit} /> Update
						</button>
					) : (
						<button onClick={addNewAlarm} className="px-4 py-2 rounded bg-[#517028] text-white ml-4 hover:bg-[#294a26]">
							<FontAwesomeIcon icon={faPlus} /> Add Alarm
						</button>
					)}
				</div>

				{/* Existing Alarms Table */}
				<div className="w-full max-w-md mb-4 text-center">
					<table className="w-full rounded-3xl">
						<thead>
							<tr>
								<th className="py-2 text-white bg-[#517028] rounded-tl-lg ">Alarm Name</th>
								<th className="py-2 text-white bg-[#517028] ">Alarm Time</th>
								<th className="py-2 text-white bg-[#517028]  rounded-tr-lg">Actions</th>
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
											<button onClick={() => editAlarm(index)} className="px-4 py-2 rounded text-[#294a26] mr-2">
												<FontAwesomeIcon icon={faEdit} style={{ color: '#294a26' }} />
											</button>
											<button onClick={() => deleteAlarm(index)} className="px-4 py-2 rounded text-[#294a26] mr-2">
												<FontAwesomeIcon icon={faTrash} style={{ color: '#294a26' }} />
											</button>
											{alarm.isActive && (
												<button
													onClick={() => handleAlarmOff(index)}
													className="px-4 py-2 rounded text-[#294a26]"
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
		</div>

	);


};

export default AlarmClock;
