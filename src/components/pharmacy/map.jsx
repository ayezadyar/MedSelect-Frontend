import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SideNav from '../sideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { auth, db } from '../../Firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
// const position1 = [31.4181, 73.0776]; // Clock Tower Faisalabad
// const position2 = [31.4338, 73.0832]; // University of Agriculture, Faisalabad

const MapExample = () => {
	const [distance, setDistance] = useState(0);
	const [isNavOpen, setNavOpen] = useState(false);
	const [requestLocations, setRequestLocations] = useState([]);
	const [position1, setPosition1] = useState(null);
	const [position2, setPosition2] = useState(null);
	const polylinePoints = [position1, position2];
	const user = auth.currentUser;

	const fetchRequestLocations = async () => {
		const user = auth.currentUser;
		if (!user) {
			console.log("No user signed in");
			return;
		}

		try {
			const q = query(collection(db, 'medRequest'), where('generatorUserId', '==', user.uid));
			const querySnapshot = await getDocs(q);
			const locations = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				acceptUserLat: doc.data().acceptUserLat,
				acceptUserLong: doc.data().acceptUserLong,
				locationLat: doc.data().location._lat,
				locationLong: doc.data().location._long,
			}));
			setRequestLocations(locations);
		} catch (error) {
			console.error("Error fetching request locations:", error);
		}
	};

	useEffect(() => {
		fetchRequestLocations();
	}, [user]); // Depends on user

	// Set positions when requestLocations updates
	useEffect(() => {
		if (requestLocations.length > 0) {
			setPosition1([requestLocations[0].acceptUserLat, requestLocations[0].acceptUserLong]);
			setPosition2([requestLocations[0].locationLat, requestLocations[0].locationLong]);
		}
	}, [requestLocations]); // Depends on requestLocations

	useEffect(() => {
		if (position1 && position2) {
			const from = L.latLng(position1);
			const to = L.latLng(position2);
			setDistance(from.distanceTo(to)); // Distance in meters
		}
	}, [position1, position2]); // Depends on position1 and position2

	const toggleNav = () => {
		setNavOpen(!isNavOpen);
	};
	console.log(polylinePoints)
	return (
		<div className="flex flex-col lg:flex-row rounded-lg items-center justify-center" style={{ height: '100vh' }}>
			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
			<div className={`flex-grow ${isNavOpen ? 'lg:ml-64' : 'lg:ml-0'} transition-all duration-300 ease-in-out`}>
				<button
					className={`absolute top-4 left-4 z-50 cursor-pointer text-2xl font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
					onClick={toggleNav}
				>
					<FontAwesomeIcon icon={faBars} size="sm" />
				</button>
				<div className="map-container" style={{
					height: '400px',
					width: '600px',
					margin: '0 auto',
					border: '2px solid #000',
					boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
				}}>
					{position1 && <MapContainer center={position1} zoom={13} style={{ height: '100%', width: '100%' }}>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						/>
						{polylinePoints[0] && polylinePoints[1] && <>
							<Marker position={position1}>
								<Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
							</Marker>
							<Marker position={position2}>
								<Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
							</Marker>
							<Polyline positions={polylinePoints} color="red" />
						</>}
					</MapContainer>}
				</div>
			</div>
		</div>
	);

};

export default MapExample;
