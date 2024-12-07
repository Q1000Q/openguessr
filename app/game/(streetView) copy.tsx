"use client"
import React, { useEffect, useRef } from 'react';

const getRandomCoords = (bounds: { north: number, south: number, east: number, west: number }) => {
  const { north, south, east, west } = bounds;
  const lat = Math.random() * (north - south) + south;
  const lng = Math.random() * (east - west) + west;
  return { lat, lng };
};


const StreetViewMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (mapRef.current) {
        const initialCoords = getRandomCoords({ north: 60, south: -60, east: 180, west: -180 });
        console.log(initialCoords);

        const streetViewService = new google.maps.StreetViewService();
        const radius = 500; // Radius in meters to search for a Street View panorama
  
        streetViewService.getPanorama(
          {
            location: initialCoords,
            radius,
          },
          (data, status) => {
            if (status === google.maps.StreetViewStatus.OK) {
              new google.maps.StreetViewPanorama(mapRef.current!, {
                position: data?.location?.latLng,
                pov: { heading: 165, pitch: 0 },
                zoom: 0,
                disableDefaultUI: true,
                showRoadLabels: false,
              });
            } else {
              console.error('Street View data not found for this location.');
            }
          }
        );
      }
    }, []);
  
    return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
};

export default StreetViewMap;