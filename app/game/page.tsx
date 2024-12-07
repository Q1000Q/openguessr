'use client'
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import StreetViewMap from './(streetView)';

const render = (status: Status) => {
  if (status === Status.LOADING) return <div>Loading...</div>;
  if (status === Status.FAILURE) return <div>Error loading map</div>;
  return <div />;
};

const WrappedStreetViewMap = () => {
  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} render={render}>
      <StreetViewMap/>
    </Wrapper>
  );
};

export default WrappedStreetViewMap;
