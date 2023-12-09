import React, { useState, useEffect } from 'react';

const AlarmClock = () => {
	const [currentTime, setCurrentTime] = useState('');
	const [alarmTime, setAlarmTime] = useState('');
	const [isAlarmActive, setIsAlarmActive] = useState(false);

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

	return (
		<div>
			<h2>Current Time: {currentTime}</h2>
			<input type="time" onChange={handleAlarmChange} />
			<p>Set Alarm for: {alarmTime ? new Date('1970-01-01T' + alarmTime).toLocaleTimeString('en-US', { hour12: true }) : ''}</p>
			{isAlarmActive && <button onClick={handleAlarmOff}>Turn Alarm Off</button>}
		</div>
	);
};

export default AlarmClock;
