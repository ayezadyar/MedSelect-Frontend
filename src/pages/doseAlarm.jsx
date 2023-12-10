import React, { useState, useEffect } from 'react';
import SideNav from '../components/sideNav'; // Import your SideNav component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Howl } from 'howler';

const AlarmClock = () => {
	const [alarms, setAlarms] = useState([{ name: '', time: '', isActive: false }]);
	const [currentTime, setCurrentTime] = useState('');
	const [isNavOpen, setNavOpen] = useState(false); // State for side nav

	const sound = new Howl({
		src: ['/alarm.mp3'],
	});

	useEffect(() => {
		const interval = setInterval(() => {
			const newTime = new Date().toLocaleTimeString('en-US', { hour12: true });
			setCurrentTime(newTime);

			alarms.forEach((alarm, index) => {
				if (formatTime(newTime) === alarm.time && alarm.isActive) {
					sound.play();
					alert(`Alarm for ${alarm.name} ringing!`);
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

	const handleAlarmChange = (index, event) => {
		const updatedAlarms = [...alarms];
		updatedAlarms[index].time = formatTime(event.target.value + ' AM'); // Adjust as needed
		updatedAlarms[index].isActive = true;
		setAlarms(updatedAlarms);
	};

	const handleNameChange = (index, event) => {
		const updatedAlarms = [...alarms];
		updatedAlarms[index].name = event.target.value;
		setAlarms(updatedAlarms);
	};

	const handleAlarmOff = (index) => {
		const updatedAlarms = [...alarms];
		updatedAlarms[index].isActive = false;
		updatedAlarms[index].time = '';
		setAlarms(updatedAlarms);
	};

	const addAlarm = () => {
		setAlarms([...alarms, { name: '', time: '', isActive: false }]);
	};

	const toggleNav = () => {
		setNavOpen(!isNavOpen);
	};

	return (
		<div className="flex flex-col h-screen">
			{/* Side Navigation */}
			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

			{/* Main Content */}
			<div className={`flex-1 flex flex-col items-center justify-center transition-margin duration-300 ${isNavOpen ? 'ml-64' : ''}`}>
				<button
					className={`absolute top-4 left-4 cursor-pointer font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
					onClick={toggleNav}
				>
					<FontAwesomeIcon icon={faBars} size="lg" />
				</button>
				<h1 className="text-2xl md:text-4xl mb-2 md:mb-4 font-bold text-[#294a26]">
					Alarm Clock <FontAwesomeIcon icon={faBell} />
				</h1>

				{alarms.map((alarm, index) => (
					<div key={index} className="mb-4 w-80 md:w-96 text-center">
						<div className="bg-[#517028] text-white p-4 rounded-lg shadow-md">
							<input
								type="text"
								placeholder="Enter Dose Name"
								value={alarm.name}
								onChange={(e) => handleNameChange(index, e)}
								className="border border-[#294a26] text-[#294a26] font-bold text-lg md:text-2xl p-3 md:p-4 rounded focus:outline-none mb-2"
							/>
							<input
								type="time"
								value={alarm.time.slice(0, -3)}
								onChange={(e) => handleAlarmChange(index, e)}
								className="border border-[#294a26] text-[#294a26] font-bold text-lg md:text-2xl p-3 md:p-4 rounded focus:outline-none"
							/>
							<p className="mt-2 text-md md:text-lg">
								Set Alarm for: <span className="text-white text-md md:text-lg font-medium">
									{alarm.time ? new Date('1970-01-01T' + alarm.time).toLocaleTimeString('en-US', { hour12: true }) : ''}
								</span>
							</p>
							{alarm.isActive && (
								<button
									onClick={() => handleAlarmOff(index)}
									className="mt-4 bg-[#294a26] text-md md:text-lg font-medium text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
								>
									Turn Alarm Off
								</button>
							)}
						</div>
					</div>
				))}

				<button onClick={addAlarm} className="mt-4 bg-[#294a26] text-md md:text-lg font-medium text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none">
					<FontAwesomeIcon icon={faPlus} /> Add Another Alarm
				</button>
			</div>
		</div>
	);
};

export default AlarmClock;
