import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './Firebase'; // Adjust this path as needed
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Alarm context initial state
const AlarmContext = createContext();

export const AlarmProvider = ({ children }) => {
	const auth = getAuth();
	const [alarms, setAlarms] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		const unsubscribeAuth = onAuthStateChanged(auth, user => {
			setCurrentUser(user);
		});

		return unsubscribeAuth;
	}, [auth]);

	useEffect(() => {
		if (!currentUser) return;

		const q = query(collection(db, "alarms"), where("uid", "==", currentUser.uid));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const alarmsArray = [];
			querySnapshot.forEach((doc) => {
				alarmsArray.push({ id: doc.id, ...doc.data() });
			});
			setAlarms(alarmsArray);
		});

		return () => unsubscribe();
	}, [currentUser]);

	const addAlarm = async (alarm) => {
		await addDoc(collection(db, "alarms"), { ...alarm, uid: currentUser?.uid });
	};

	const deleteAlarm = async (id) => {
		await deleteDoc(doc(db, "alarms", id));
	};

	const updateAlarm = async (id, data) => {
		await updateDoc(doc(db, "alarms", id), data);
	};

	return (
		<AlarmContext.Provider value={{ alarms, addAlarm, deleteAlarm, updateAlarm }}>
			{children}
		</AlarmContext.Provider>
	);
};

export const useAlarms = () => useContext(AlarmContext);
