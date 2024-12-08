"use client"
import React, { useEffect, useRef } from 'react';

interface StreetViewProps {
  lat: number;
  lng: number;
}

const StreetViewMap = ({ lat, lng }: StreetViewProps) => {
  const mapRef = useRef(null);
  useEffect(() => {
    const initializeMap = async () => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 14,
        });
        const panorama = new google.maps.StreetViewPanorama(
          mapRef.current,
          {
            position: { lat, lng },
            pov: { heading: 165, pitch: 0 },
            zoom: 0,
            disableDefaultUI: true,
            showRoadLabels: false,
          }
        );
        map.setStreetView(panorama);
      }
    };
    initializeMap();
  }, [lat, lng]);
  return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
};

export default StreetViewMap;