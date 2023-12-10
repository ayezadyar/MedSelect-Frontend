import React, { useState, useEffect } from 'react';
import SideNav from '../components/sideNav';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Howl } from 'howler';

const AlarmClock = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [isNavOpen, setNavOpen] = useState(false);
  const [oldAlarms, setOldAlarms] = useState([]);
  const [selectedOldAlarm, setSelectedOldAlarm] = useState('');

  const sound = new Howl({
    src: ['/alarm.mp3'],
  });

  const playSound = () => {
    sound.play();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date().toLocaleTimeString('en-US', { hour12: true });
      setCurrentTime(newTime);

      if (formatTime(newTime) === alarmTime && isAlarmActive) {
        playSound();
        alert('Alarm ringing!');
        handleAlarmOff();
        saveAlarm(alarmTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarmTime, isAlarmActive]);

  useEffect(() => {
    const savedAlarms = JSON.parse(localStorage.getItem('oldAlarms')) || [];
    setOldAlarms(savedAlarms);
  }, []);

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
    const timeValue = formatTime(event.target.value + ' AM');
    setAlarmTime(timeValue);
    setIsAlarmActive(false); // Reset alarm state when changing the time
  };

  const handleAlarmOff = () => {
    setIsAlarmActive(false);
    setAlarmTime('');
  };

  const saveAlarm = (alarm) => {
    const updatedAlarms = [...oldAlarms, alarm];
    setOldAlarms(updatedAlarms);
    localStorage.setItem('oldAlarms', JSON.stringify(updatedAlarms));
  };

  const deleteAlarm = (index) => {
    const updatedAlarms = [...oldAlarms];
    updatedAlarms.splice(index, 1);
    setOldAlarms(updatedAlarms);
    localStorage.setItem('oldAlarms', JSON.stringify(updatedAlarms));
  };

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  const handleOldAlarmChange = (event) => {
    setSelectedOldAlarm(event.target.value);
  };

  const setOldAlarm = () => {
    if (selectedOldAlarm) {
      setAlarmTime(formatTime(selectedOldAlarm));
      setIsAlarmActive(true);
    }
  };

  const confirmSetAlarm = () => {
    if (alarmTime) {
      setIsAlarmActive(true);
    } else {
      alert('Please select a valid alarm time before confirming.');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <div className={`flex-1 flex flex-col items-center justify-center transition-margin duration-300 ${isNavOpen ? 'ml-64' : ''}`}>
        <button className={`absolute top-4 left-4 cursor-pointer font-bold ${isNavOpen ? 'text-white' : 'text-black'}`} onClick={toggleNav}>
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <h1 className="text-2xl md:text-4xl mb-2 md:mb-4 font-bold text-[#294a26]">
          Alarm Clock <FontAwesomeIcon icon={faBell} />
        </h1>
        <div className="mb-4 w-80 md:w-96 text-center">
          <div className="bg-[#517028] text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg md:text-2xl mb-2 md:mb-4">Current Time: {currentTime}</h2>
            <input
              type="time"
              onChange={handleAlarmChange}
              className="border border-[#294a26] text-[#294a26] font-bold text-lg md:text-2xl p-3 md:p-4 rounded focus:outline-none"
            />
            <p className="mt-2 text-md md:text-lg">
              Set Alarm for:{' '}
              <span className="text-white text-md md:text-lg font-medium">
                {alarmTime ? new Date('1970-01-01T' + alarmTime).toLocaleTimeString('en-US', { hour12: true }) : ''}
              </span>
            </p>
            {isAlarmActive ? (
              <button
                onClick={handleAlarmOff}
                className="mt-4 bg-[#294a26] text-md md:text-lg font-medium text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
              >
                Turn Alarm Off
              </button>
            ) : (
              <button
                onClick={confirmSetAlarm}
                className="mt-4 bg-[#294a26] text-md md:text-lg font-medium text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
              >
                Confirm Set Alarm
              </button>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl mb-2 font-bold text-[#294a26]">Old Alarms</h2>
          <select
            onChange={handleOldAlarmChange}
            className="border border-[#294a26] text-[#294a26] font-bold text-md md:text-lg p-3 md:p-4 rounded focus:outline-none"
          >
            <option value="">Select Old Alarm</option>
            {oldAlarms.map((alarm, index) => (
              <option key={index} value={alarm}>
                {new Date('1970-01-01T' + alarm).toLocaleTimeString('en-US', { hour12: true })}
              </option>
            ))}
          </select>
          <button
            onClick={setOldAlarm}
            className="mt-4 bg-[#294a26] text-md md:text-lg font-medium text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
          >
            Set Old Alarm
          </button>
          <div className="mt-4">
            <h2 className="text-lg mb-2 font-bold text-[#294a26]">Delete Old Alarms</h2>
            <ul className="list-disc pl-8 text-md md:text-lg">
			{oldAlarms.map((alarm, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{new Date('1970-01-01T' + alarm).toLocaleTimeString('en-US', { hour12: true })}</span>
                  <button
                    onClick={() => deleteAlarm(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmClock;



