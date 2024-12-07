'use client'
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import StreetViewMap from './(streetView)';
import { useEffect, useState } from 'react';
import RoundEnd from './(roundEnd)';
import GameEnd from './(gameEnd)';
import GameMap from './(gameMap)';
import getRandomCoordsFromLists from './(randomLocation)';
import { LoadScript } from '@react-google-maps/api';

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

  const [view, setView] = useState("game");

  const [currentRound, setCurrentRound] = useState(1);
  const [points, setPoints] = useState(0);

  const [locationLat, setLocationLat] = useState(0);
  const [locationlng, setLocationLng] = useState(0);

  const [selectedLat, setSelectedLat] = useState(50);
  const [selectedlng, setSelectedLng] = useState(50);

  const [currentTime, setCurrentTime] = useState(time);

  useEffect(() => {
    const fetchCoords = async () => {
      const { props: { lat, lng } } = await getRandomCoordsFromLists();
      await setLocationLat(lat);
      await setLocationLng(lng);
    };
    fetchCoords();
  }, [])
  
  useEffect(() => {
    setCurrentTime(time);
  }, [view, time])

  useEffect(() => {
    if (currentTime <= 0) {
      setCurrentTime(time);
      setView("roundEnd");
    };
    const intervalId = setInterval(() => {
      setCurrentTime((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [currentTime, currentRound, rounds, time]);

  return (
    view == "game" ? (<div className='h-[100vh] w-full'>
      <button onClick={() => location.reload()} className='absolute z-50 top-4 left-4 bg-black/70 p-4 rounded-full'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
      <div className='absolute top-2 z-50 left-1/2 transform -translate-x-1/2 text-3xl bg-black/70 py-4 px-16 rounded-xl'>
        <strong>{`${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${(currentTime % 60).toString().padStart(2, '0')}`}</strong>
      </div>
      <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} render={render}>
        <StreetViewMap lat={locationLat} lng={locationlng}/>
      </Wrapper>
      <div className='absolute z-50 right-2 bottom-2 h-[35vh] w-1/4'>
        <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} render={render}>
          <GameMap location={{ lat: locationLat, lng: locationlng }} selected={{ lat: selectedLat, lng: selectedlng }}></GameMap>
        </Wrapper>
      </div>
    </div>) : view == "roundEnd" ? (<RoundEnd currentRound={currentRound} rounds={rounds} points={points} setCurrentRound={setCurrentRound} setView={setView} setPoints={setPoints} />) : (<GameEnd points={points} />)
  );
};

export default Game;
