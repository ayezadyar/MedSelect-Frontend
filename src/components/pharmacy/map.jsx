import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet to access its utilities
import 'leaflet/dist/leaflet.css';

const position1 = [31.4181, 73.0776]; // Clock Tower Faisalabad
const position2 = [31.4338, 73.0832]; // University of Agriculture, Faisalabad

const MapExample = () => {
	// Define an array of LatLng objects representing the points along the polyline
	const polylinePoints = [position1, position2];

	// State to store the distance
	const [distance, setDistance] = useState(0);

	// Calculate the distance when the component mounts
	useEffect(() => {
		const from = L.latLng(position1);
		const to = L.latLng(position2);
		const dist = from.distanceTo(to); // Distance in meters
		setDistance(dist);
	}, []);

	return (
		<MapContainer center={position1} zoom={13} style={{ height: '100vh', width: '100%' }}>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			<Marker position={position1}>
				<Popup>
					Clock Tower Faisalabad. <br /> A historic landmark.
				</Popup>
			</Marker>
			<Marker position={position2}>
				<Popup>
					University of Agriculture, Faisalabad. <br /> A premier agricultural education institution.
				</Popup>
			</Marker>
			{/* Draw a polyline between the positions */}
			<Polyline positions={polylinePoints} color="red" />
			{/* Optionally, show the distance in a Popup or elsewhere */}
			<Marker position={position1}>
				<Popup>Distance to University of Agriculture: {distance.toFixed(2)} meters</Popup>
			</Marker>
		</MapContainer>
	);
};

export default MapExample;
