import React, { useState, useEffect } from 'react';
import SideNav from '../components/sideNav'; // Import your SideNav component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHippo } from "@fortawesome/free-solid-svg-icons";
const AlarmClock = () => {
	const [currentTime, setCurrentTime] = useState('');
	const [alarmTime, setAlarmTime] = useState('');
	const [isAlarmActive, setIsAlarmActive] = useState(false);
	const [isNavOpen, setNavOpen] = useState(false); // State for side nav

	useEffect(() => {
		const interval = setInterval(() => {
			const newTime = new Date().toLocaleTimeString('en-US', { hour12: true });
			setCurrentTime(newTime);

			if (formatTime(newTime) === alarmTime && isAlarmActive) {
				alert('Alarm ringing!');
				// You can replace this alert with any sound or other notification
				handleAlarmOff();
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [alarmTime, isAlarmActive]);

	// Helper function to convert 12-hour format to 24-hour format for comparison
	const formatTime = (time12h) => {
		const [time, modifier] = time12h.split(' ');
		let [hours, minutes] = time.split(':');
		if (hours === '12') {
			hours = '00';
		}
		if (modifier === 'PM') {
			hours = parseInt(hours, 10) + 12;
		}
		return `${hours}:${minutes}:00`;
	};

	const handleAlarmChange = (event) => {
		const timeValue = formatTime(event.target.value + ' AM'); // Default to AM for input; adjust as needed
		setAlarmTime(timeValue);
		setIsAlarmActive(true);
	};

	const handleAlarmOff = () => {
		setIsAlarmActive(false);
		setAlarmTime('');
	};

	const toggleNav = () => {
		setNavOpen(!isNavOpen);
	};

	return (
		<div className="flex h-screen">
			{/* Side Navigation */}
			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
			<div
				className={`absolute top-4 left-4 cursor-pointer font-bold ${isNavOpen
					? 'text-white'
					: 'text-black'
					}`}
				onClick={toggleNav}
			>
				<FontAwesomeIcon icon={faBars} size="lg" />
			</div>
			{/* Main Content */}
			<div className={`flex-1 flex flex-col items-center justify-center transition-margin duration-300 ${isNavOpen ? 'ml-64' : ''}`}>
				<h1 className="text-4xl mb-4">Alarm Clock</h1>
				<div className="mb-8 w-96 text-center">
					<h2 className="text-2xl mb-2">Current Time: {currentTime}</h2>
					<input
						type="time"
						onChange={handleAlarmChange}
						className="border border-gray-300 p-2 rounded"
					/>
					<p className="mt-2">Set Alarm for: {alarmTime ? new Date('1970-01-01T' + alarmTime).toLocaleTimeString('en-US', { hour12: true }) : ''}</p>
					{isAlarmActive && (
						<button
							onClick={handleAlarmOff}
							className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
						>
							Turn Alarm Off
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default AlarmClock;
