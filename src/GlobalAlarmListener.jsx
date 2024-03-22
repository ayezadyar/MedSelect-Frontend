import React, { useEffect } from 'react';
import { useAlarms } from './AlarmContext'; // Adjust the import path as needed
import { Howl } from 'howler';
import { toast } from 'react-toastify';

const sound = new Howl({
	src: ['/alarm.mp3'], // Make sure this path is correct for your project
});

const GlobalAlarmListener = () => {
	const { alarms, updateAlarm } = useAlarms();

	useEffect(() => {
		const checkAlarms = () => {
			const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true });

			alarms.forEach((alarm) => {
				if (formatTime(currentTime) === alarm.time && alarm.isActive) {
					sound.play();
					toast.info(`Time for ${alarm.name}`, {
						position: "top-right",
						autoClose: 5000,
					});
					// Call updateAlarm function to set the alarm's isActive to false
					updateAlarm(alarm.id, { isActive: false });
				}
			});
		};

		const interval = setInterval(checkAlarms, 1000);

		return () => clearInterval(interval);
	}, [alarms, updateAlarm]);

	// Function to convert 12h time format to 24h format for comparison
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

	return null; // This component doesn't render anything
};

export default GlobalAlarmListener;
