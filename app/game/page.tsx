"use client"
import React, { useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const render = (status: Status) => {
  if (status === Status.LOADING) return <div>Loading...</div>;
  if (status === Status.FAILURE) return <div>Error loading map</div>;
  return <div />;
};

const StreetViewMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 37.869085, lng: -122.254775 },
        zoom: 14,
      });

      const panorama = new google.maps.StreetViewPanorama(
        mapRef.current,
        {
          position: { lat: 37.869085, lng: -122.254775 },
          pov: { heading: 165, pitch: 0 },
          zoom: 0,
          disableDefaultUI: true,
        }
      );

      map.setStreetView(panorama);
    }
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
};

const WrappedStreetViewMap = () => {
  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} render={render}>
      <StreetViewMap />
    </Wrapper>
  );
};

export default WrappedStreetViewMap;
