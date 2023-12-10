import React, { useState, useEffect } from 'react';
import SideNav from '../components/sideNav'; // Adjust this import to your project's file structure
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Howl } from 'howler';

const AlarmClock = () => {
	const [alarms, setAlarms] = useState([]);
	const [newAlarmTime, setNewAlarmTime] = useState('');
	const [currentTime, setCurrentTime] = useState('');
	const [isNavOpen, setNavOpen] = useState(false);

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
		if (!newAlarmTime) {
			alert("Please set a time for the alarm.");
			return;
		}
		const formattedTime = formatTime(newAlarmTime + ' AM'); // Adjust as needed
		setAlarms([...alarms, { name: `Alarm ${alarms.length + 1}`, time: formattedTime, isActive: true }]);
		setNewAlarmTime('');
	};

	const toggleNav = () => {
		setNavOpen(!isNavOpen);
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
				<h1 className="text-2xl mb-2 font-bold">
					Your Alarms
				</h1>

				{/* Display Current Time */}
				<p className="text-lg mb-4 font-bold">
					Current Time: {currentTime}
				</p>

				{/* Existing Alarms */}
				{alarms.map((alarm, index) => (
					<div key={index} className="mb-4 w-full text-center">
						<div className="p-4 flex flex-col items-center justify-center">
							{/* Alarm Time */}
							<span className="text-md md:text-lg font-medium">
								{alarm.time ? new Date('1970-01-01T' + alarm.time).toLocaleTimeString('en-US', { hour12: true }) : ''}
							</span>

							{/* Alarm Name */}
							<div className="mt-2 font-medium">
								{alarm.name}
							</div>

							{/* Turn Off Alarm Button */}
							{alarm.isActive && (
								<button
									onClick={() => handleAlarmOff(index)}
									className="mt-2 px-4 py-2 rounded bg-red-600 text-white"
								>
									Turn Alarm Off
								</button>
							)}
						</div>

						<hr className="my-4 bg-gray-300" />
					</div>
				))}

				{/* Input Field for New Alarm Time */}
				<div className="mb-4">
					<input
						type="time"
						value={newAlarmTime}
						onChange={(e) => setNewAlarmTime(e.target.value)}
						className="border p-3 rounded focus:outline-none"
					/>
				</div>

				{/* Button to Add New Alarm */}
				<button onClick={addNewAlarm} className="px-4 py-2 rounded bg-green-600 text-white">
					<FontAwesomeIcon icon={faPlus} /> Add Alarm
				</button>
			</div>
		</div>
	);
};

export default AlarmClock;
