import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const center = {
  lat: 0,
  lng: 0
};

interface Location {
  lat: number;
  lng: number;
}

interface GameMapProps {
  location: Location;
  selected: Location;
}

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const GameMap: React.FC<GameMapProps> = ({ location: { lat: locationLat, lng: locationLng }, selected: { lat: selectedLat, lng: selectedLng } }) => {
    console.log(locationLat, " ", locationLng, " ", selectedLat, " ", selectedLng);
    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={3}
            clickableIcons={false}
            options={{ disableDefaultUI: true }}
        >
            <Marker position={{ lat: locationLat, lng: locationLng }} />
            <Marker position={{ lat: selectedLat, lng: selectedLng }} />
        </GoogleMap>
    )
}

export default GameMap;