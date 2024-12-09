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

const RoundEndMap = ({ location: { lat, lng }, selected: { selectedLat, selectedLng } }: RoundEndMapProps) => {

    const [latLocal] = useState(lat);
    const [lngLocal] = useState(lng);

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: latLocal, lng: lngLocal }}
            zoom={3}
            clickableIcons={false}
            options={{ disableDefaultUI: true }}
        >
            <Marker position={{ lat: latLocal, lng: lngLocal }} />
            {selectedLat && selectedLng ? (<Marker position={{ lat: selectedLat, lng: selectedLng }} />) : ""}
            {selectedLat && selectedLng ? (<Polyline
                path={[{lat: latLocal, lng: lngLocal}, {lat: selectedLat, lng: selectedLng}]}
                options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                }}
            />): ""}
        </GoogleMap>
    )
}

export default RoundEndMap;