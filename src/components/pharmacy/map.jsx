import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SideNav from '../sideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const position1 = [31.4181, 73.0776]; // Clock Tower Faisalabad
const position2 = [31.4338, 73.0832]; // University of Agriculture, Faisalabad

const MapExample = () => {
	const polylinePoints = [position1, position2];
	const [distance, setDistance] = useState(0);
	const [isNavOpen, setNavOpen] = useState(false);

	useEffect(() => {
		const from = L.latLng(position1);
		const to = L.latLng(position2);
		setDistance(from.distanceTo(to)); // Distance in meters
	}, []);

	const toggleNav = () => {
		setNavOpen(!isNavOpen);
	};

	return (
		<div className="flex flex-col lg:flex-row rounded-lg">
			<SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
			<div className={`flex-grow ${isNavOpen ? 'lg:ml-64' : 'lg:ml-0'} transition-all duration-300 ease-in-out`}>
				<button
					className={`absolute top-4 left-4 z-50 cursor-pointer text-2xl font-bold ${isNavOpen ? 'text-white' : 'text-black'}`}
					onClick={toggleNav}
				>
					<FontAwesomeIcon icon={faBars} size="sm" />
				</button>
				{/* Map container with fixed size */}
				<div className="map-container" style={{ height: '400px', width: '600px', margin: '0 auto' }}>
					<MapContainer center={position1} zoom={13} style={{ height: '100%', width: '100%' }}>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						/>
						<Marker position={position1}>
							<Popup>Clock Tower Faisalabad. <br /> A historic landmark.</Popup>
						</Marker>
						<Marker position={position2}>
							<Popup>University of Agriculture, Faisalabad. <br /> A premier agricultural education institution.</Popup>
						</Marker>
						<Polyline positions={polylinePoints} color="red" />
						<Marker position={position1}>
							<Popup>Distance to University of Agriculture: {distance.toFixed(2)} meters</Popup>
						</Marker>
					</MapContainer>
				</div>
			</div>
		</div>
	);
};

export default MapExample;
