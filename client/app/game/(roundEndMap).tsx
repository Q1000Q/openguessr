import React, { useState } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';

interface RoundEndMapProps {
  location: {
    lat: number;
    lng: number;
  };
  selected: {
    selectedLat: number | null;
    selectedLng: number | null;
  };
}

const containerStyle = {
  width: '100%',
  height: '80vh'
};

const greenMarkerIcon = {
    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // URL of a green marker icon
};

const redMarkerIcon = {
    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // URL of a green marker icon
};

const RoundEndMap = ({ location: { lat, lng }, selected: { selectedLat, selectedLng } }: RoundEndMapProps) => {

    const [latLocal] = useState(lat);
    const [lngLocal] = useState(lng);

    const center = React.useMemo(() => ({
        lat: latLocal,
        lng: lngLocal
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={3}
            clickableIcons={false}
            options={{ disableDefaultUI: true }}
        >
            <Marker position={{ lat: latLocal, lng: lngLocal }} icon={redMarkerIcon} />
            {selectedLat && selectedLng ? (<Marker position={{ lat: selectedLat, lng: selectedLng }} icon={greenMarkerIcon} />) : ""}
            {selectedLat && selectedLng ? (<Polyline
                path={[{lat: latLocal, lng: lngLocal}, {lat: selectedLat, lng: selectedLng}]}
                options={{
                    strokeColor: '#FF00FF',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                }}
            />): ""}
        </GoogleMap>
    )
}

export default RoundEndMap;