// components/StreetViewMap.js
import React, { useEffect, useRef } from 'react';

const defaultBounds = { north: 90, south: -90, east: 180, west: -180 };

const getRandomCoords = ( bounds: { north: number, south: number, east: number, west: number } ) => {
  const { north, south, east, west } = bounds;
  const lat = Math.random() * (north - south) + south;
  const lng = Math.random() * (east - west) + west;
  return { lat, lng };
};

const StreetViewMap = ({ bounds = defaultBounds }: { bounds?: {north: number, south: number, east: number, west: number } }) => {
  const mapRef = useRef(null);

  const findStreetView = React.useCallback((streetViewService: google.maps.StreetViewService, bounds: { north: number, south: number, east: number, west: number } = defaultBounds, retries = 50) => {
    if (retries === 0) {
      console.error('No Street View found after multiple attempts.');
      return;
    }

    const { lat, lng } = getRandomCoords(bounds);
    streetViewService.getPanorama(
      {
        location: { lat, lng },
        radius: 50000, // Radius in meters to search for a Street View panorama
      },
      (data, status) => {
        if (status === google.maps.StreetViewStatus.OK) {
          const panorama = new google.maps.StreetViewPanorama(mapRef.current!, {
            position: data?.location?.latLng,
            pov: { heading: 165, pitch: 0 },
            zoom: 0,
            disableDefaultUI: true,
            showRoadLabels: false,
          });

          const map = new google.maps.Map(mapRef.current!, {
            center: data?.location?.latLng,
            zoom: 14,
          });

          map.setStreetView(panorama);
        } else {
          console.log('Street View data not found for this location. Retrying...');
          findStreetView(streetViewService, bounds, retries - 1);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      const streetViewService = new google.maps.StreetViewService();
      findStreetView(streetViewService, bounds);
    }
  }, [bounds, findStreetView]);

  return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
};

export default StreetViewMap;
