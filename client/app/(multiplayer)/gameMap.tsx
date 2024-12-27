import React, { Dispatch, SetStateAction, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const center = {
  lat: 0,
  lng: 0
};

interface GameMapProps {
  selected: {
    setSelectedLatGame: Dispatch<SetStateAction<number | null>>;
    setSelectedLngGame: Dispatch<SetStateAction<number | null>>;
  };
  markerURL: string;
}

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const GameMap = ({ selected: { setSelectedLatGame, setSelectedLngGame }, markerURL }: GameMapProps) => {
    const [selectedLat, setSelectedLat] = useState<number | null>(null);
    const [selectedLng, setSelectedLng] = useState<number | null>(null);

    const markerIcon = {
        url: markerURL,
    };

    React.useEffect(() => {
        setSelectedLatGame(selectedLat);
        setSelectedLngGame(selectedLng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLat, selectedLng]);

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
            {selectedLat && selectedLng ? (<Marker position={{ lat: selectedLat, lng: selectedLng }} icon={markerIcon} />) : ""}
        </GoogleMap>
    )
}

export default GameMap;