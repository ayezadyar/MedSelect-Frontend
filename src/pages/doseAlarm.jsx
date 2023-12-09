import React, { useState, useEffect } from 'react';

const AlarmClock = () => {
	const [currentTime, setCurrentTime] = useState('');
	const [alarmTime, setAlarmTime] = useState('');
	const [isAlarmActive, setIsAlarmActive] = useState(false); // Initialize as false

	useEffect(() => {
		const interval = setInterval(() => {
			const newTime = new Date().toLocaleTimeString('en-US', { hour12: false });
			setCurrentTime(newTime);

			if (newTime === alarmTime && isAlarmActive) {
				alert('Alarm ringing!');
				// You can replace this alert with any sound or other notification
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [alarmTime, isAlarmActive]);

	const handleAlarmChange = (event) => {
		const timeValue = event.target.value + ':00';
		setAlarmTime(timeValue);
		setIsAlarmActive(true); // Reactivate the alarm when time is set
	};

	const handleAlarmOff = () => {
		setIsAlarmActive(false); // Turn off the alarm
		setAlarmTime(''); // Reset the alarm time to its initial state
	};

	return (
		<div>
			<h2>Current Time: {currentTime}</h2>
			<input type="time" value={alarmTime.slice(0, -3)} onChange={handleAlarmChange} />
			<p>Set Alarm for: {alarmTime}</p>
			{isAlarmActive && <button onClick={handleAlarmOff}>Turn Alarm Off</button>}
		</div>
	);
};

export default AlarmClock;
