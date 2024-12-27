import React, { useState } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import { Game, lobbyData, userMarkers } from './lobby';

interface RoundEndMapProps {
  location: {
    lat: number;
    lng: number;
  };
  selected: {
    selectedLat: number | null;
    selectedLng: number | null;
  };
  game: Game;
  lobby: lobbyData;
  username: string;
}

const containerStyle = {
  width: '100%',
  height: '70vh'
};

const blackMarkerIcon = {
    url: '/black-dot.png', // URL of a green marker icon
};

const RoundEndMap = ({ location: { lat, lng }, selected: { selectedLat, selectedLng }, game, lobby, username }: RoundEndMapProps) => {

    const [latLocal] = useState<number>(lat);
    const [lngLocal] = useState<number>(lng);

    const center = React.useMemo(() => ({
        lat: latLocal,
        lng: lngLocal
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    const users = lobby.users;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={3}
            clickableIcons={false}
            options={{ disableDefaultUI: true }}
        >
            <Marker position={{ lat: latLocal, lng: lngLocal }} icon={blackMarkerIcon} />
            {selectedLat && selectedLng ? (<Marker key={"localUser"} position={{ lat: selectedLat, lng: selectedLng }} icon={userMarkers[lobby.users.findIndex(user => user === username) as keyof typeof userMarkers]} />) : null}
            {selectedLat && selectedLng ? (<Polyline
                path={[{lat: latLocal, lng: lngLocal}, {lat: selectedLat, lng: selectedLng}]}
                options={{
                    strokeColor: '#000000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                }}
            />): null}
            {users.map(user => {
                const guessedLocation = game.guessedLocations[user];
                const userMarker = userMarkers[lobby.users.findIndex(userM => userM === user) as keyof typeof userMarkers];
                return guessedLocation ? (
                    <Marker key={user} position={{ lat: guessedLocation.lat, lng: guessedLocation.lng }} icon={userMarker} />
                ) : null;
            })}
        </GoogleMap>
    )
}

export default RoundEndMap;