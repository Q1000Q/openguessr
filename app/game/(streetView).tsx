"use client"
import React, { useEffect, useRef } from 'react';

interface StreetViewProps {
  lat: number;
  lng: number;
  moving: boolean;
  zoomPan: boolean;
}

const StreetViewMap = ({ lat, lng, moving, zoomPan }: StreetViewProps) => {
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
            pov: { heading: Math.random() * 360, pitch: 0 },
            zoom: 0,
            disableDefaultUI: false,
            fullscreenControl: false,
            enableCloseButton: false,
            addressControl: false,
            showRoadLabels: false,
            clickToGo: moving,
            scrollwheel: zoomPan,
          }
        );
        map.setStreetView(panorama);
      }
    };
    initializeMap();
  }, [lat, lng, moving, zoomPan]);
  return <div ref={mapRef} style={{ width: '100%', height: '100vh', pointerEvents: zoomPan ? 'auto' : 'none' }} />;
};

export default StreetViewMap;