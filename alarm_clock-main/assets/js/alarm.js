const alarmsDetails = [];   // array of objects contains interval and alarm id, used for delete the alarm.

// Function to set the current-time on the front-end
function currentTimeSetter() {
  const now = new Date().toString();    // converting date into string
  const timeContainer = document.getElementById('time');    // fetching element to show time
  timeContainer.innerText = now.substring(16, 24);           // putting current-time in time-container element
  return;
}

// Putting the above time function in setInterval to update the time every half-second
setInterval(currentTimeSetter, 500);

// Fetching set-alarm button
const setAlarmButton = document.getElementById('set-alarm');

// Adding click event on setAlarm button which calls the function 'addAlarm()' on click
setAlarmButton.addEventListener('click', addAlarm);

// Function to add new alarm in container and setting the alarm
function addAlarm(e) {
  e.preventDefault();  // preventing default behavior of button
  const inputTime = document.getElementById('input-time').value;  // fetching the value of input-time

  var id = setAlarm(inputTime); // return interval_id if input time is valid else return false

  if (id == false) {  // if invalid time
    return;
  } else {
    var alarmObj = { interval_id: id, alarm_id: inputTime };  // creating the object which will be pushed in alarmDetails array
    alarmsDetails.push(alarmObj);

    const alarmsContainer = document.getElementById('alarms-container');  // fetching alarms-container element

    const mainDiv = document.createElement('div');  // creating element which contains alarm
    mainDiv.setAttribute('class', 'alarm');          // setting class to above alarm div
    mainDiv.setAttribute('id', inputTime)            // setting id to above alarm div
    const timePara = document.createElement('p');   // creating para-element which will contain the alarm time 
    const iconClock = document.createElement('i');  // creating clock icon element
    iconClock.setAttribute('class', 'fas fa-clock'); // setting class to clock icon element
    timePara.append(iconClock);                     // appending icon element to 'timePara'
    timePara.append(' ' + inputTime + ':00');           // setting alarm-time in time-para 
    const trashButton = document.createElement('button');   // creating alarm delete button
    trashButton.setAttribute('data-value', inputTime);       // setting data-value attribute to alarm delete button used for delete alarm
    trashButton.setAttribute('class', 'delete');             // setting class to delete button
    const iconTrash = document.createElement('i');          // creating icon element
    iconTrash.setAttribute('class', 'fas fa-trash');         // setting class to icon element
    trashButton.append(iconTrash);                          // appending icon to trash button
    mainDiv.append(timePara);                               // appending timePara to main-alarm div
    mainDiv.append(trashButton);                            // appending delete button to main div
    alarmsContainer.prepend(mainDiv);                       // prepending mainDiv to alarmsContainer

    // Adding event listener to newly created alarm which will call the 'deleteAlarm()' function to delete the alarm
    mainDiv.addEventListener('click', function () {
      deleteAlarm(inputTime);
    });
  }
}

// Function to delete alarm
function deleteAlarm(inputTime) {

  var deleteElem = document.getElementById(inputTime); // removing alarm div from alarms-container
  deleteElem.parentNode.removeChild(deleteElem);

  // Finding the setInterval alarm ID from 'alarmsDetails[]' array and clearing the Interval
  for (let i = 0; i < alarmsDetails.length; i++) {
    if (alarmsDetails[i].alarm_id == inputTime) {
      clearInterval(alarmsDetails[i].interval_id);
    }
  }
}

// Rings alarms by alerting on the webpage and playing a sound
function ringAlarm(alarmDate, id, inputTime) {
  const now = new Date();
  if (alarmDate - now <= 0) {
    // Play a sound when the alarm rings
    playAlarmSound();

    alert('Alarm Ringing.....TAKE DOSE!');
    clearInterval(id);
    const alarmToDelete = document.getElementById(inputTime);
    alarmToDelete.parentNode.removeChild(alarmToDelete);         // deleting the alarm after alert
  }
}

// Function to play the alarm sound
function playAlarmSound() {
  const audio = new Audio("html" ); // Replace 'path/to/your/alarm-sound.mp3' with the actual path to your sound file
  audio.play();
}

// Converts the input (hh:mm) time into complete time
function alarmTime(time) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  time = new Date(today + ' ' + time + ':00');
  return time;
}

// Set the alarm of inputTime
function setAlarm(inputTime) {
  const alarmDate = alarmTime(inputTime);   // getting alarm date from alarmTime() function
  const now = new Date();
  if (alarmDate - now >= 0) {                 // only saving the alarm for today only and of future time
    console.log('alarm set');
    var id = setInterval(function () {
      ringAlarm(alarmDate, id, inputTime);
    }, 1000);
    return id;
  }
  else {
    alert('Alarm cant be saved for the past time');    // if input-time is from past then it will return false
    return false;
  }
}
// ... (previous code)

// Rings alarms by alerting on the webpage and playing a sound
function ringAlarm(alarmDate, id, inputTime) {
  const now = new Date();
  if (alarmDate - now <= 0) {
    // Play a sound when the alarm rings
    playAlarmSound();

    alert('Alarm Ringing.....TAKE DOSE!');
    clearInterval(id);
    const alarmToDelete = document.getElementById(inputTime);
    alarmToDelete.parentNode.removeChild(alarmToDelete);         // deleting the alarm after alert
  }
}

// Function to play the alarm sound
function playAlarmSound() {
  const audio =   new Audio('C:\\Users\\M. Owais Dogar\\Downloads\\alarm_clock-main\\alarm_clock-main\\assets\\twirling-intime-lenovo-k8-note-alarm-tone-41440.mp3');
  // Replace 'path/to/your/alarm-sound.mp3' with the actual path to your sound file
  audio.play();
}

// ... (rest of the code)

// Adding event listener to newly created alarm which will call the 'deleteAlarm()' function to delete the alarm
mainDiv.addEventListener('click', function () {
  deleteAlarm(inputTime);
  // Play the sound on user interaction
  playAlarmSound();
});

// ... (rest of the code)
// Rings alarms by alerting on the webpage and playing a sound
// Rings alarms by showing a notification and playing a sound
