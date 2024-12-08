import React, { Dispatch, SetStateAction, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const center = {
  lat: 0,
  lng: 0
};

interface GameMapProps {
  location: {
    lat: number;
    lng: number;
  };
  selected: {
    setSelectedLatGame: Dispatch<SetStateAction<number | null>>;
    setSelectedLngGame: Dispatch<SetStateAction<number | null>>;
  };
}

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const GameMap = ({ location: { lat, lng }, selected: { setSelectedLatGame, setSelectedLngGame } }: GameMapProps) => {
    const [selectedLat, setSelectedLat] = useState<number | null>(null);
    const [selectedLng, setSelectedLng] = useState<number | null>(null);

    setSelectedLatGame(selectedLat);
    setSelectedLngGame(selectedLng);

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={3}
            clickableIcons={false}
            options={{ disableDefaultUI: true }}
            onClick={(e) => {
                const lat = e.latLng?.lat();
                const lng = e.latLng?.lng();
                if (lat && lng) {
                    setSelectedLat(lat);
                    setSelectedLng(lng);
                }
            }}
        >
            <Marker position={{ lat: lat, lng: lng }} />
            {selectedLat && selectedLng ? (<Marker position={{ lat: selectedLat, lng: selectedLng }} />) : ""}
        </GoogleMap>
    )
}

export default GameMap;