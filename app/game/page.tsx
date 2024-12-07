'use client'
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import StreetViewMap from './(streetView)';

const render = (status: Status) => {
  if (status === Status.LOADING) return <div>Loading...</div>;
  if (status === Status.FAILURE) return <div>Error loading map</div>;
  return <div />;
};

interface GameProps {
  rounds: number;
  time: number;
}

const Game = ({ rounds, time }: GameProps) => {
  return (
    <div className='h-[100vh] w-full'>
      <button onClick={() => location.reload()} className='absolute z-50 top-4 left-4 bg-black/70 p-4 rounded-full'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
      <div className='absolute top-2 z-50 left-1/2 transform -translate-x-1/2 text-3xl bg-black/70 py-4 px-16 rounded-xl'>
        {`${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`}
      </div>
      <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} render={render}>
        <StreetViewMap/>
      </Wrapper>
    </div>
  );
};

export default Game;
