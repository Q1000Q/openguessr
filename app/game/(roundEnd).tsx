import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import RoundEndMap from './(roundEndMap)';

interface RoundEndProps {
    currentRound: number;
    rounds: number;
    points: number;
    setCurrentRound: Dispatch<SetStateAction<number>>;
    setView: Dispatch<SetStateAction<string>>;
    setPoints: Dispatch<SetStateAction<number>>;
    selectedLocation: {
        selectedLat: number | null;
        selectedLng: number | null;
    };
    location: {
        locationLat: number;
        locationLng: number;
    };
}

const RoundEnd = ({currentRound, rounds, points, setCurrentRound, setView, setPoints, selectedLocation: {selectedLat, selectedLng}, location: {locationLat, locationLng}}: RoundEndProps) => {
    useEffect(() => {
        setCurrentRound(currentRound + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [distance, setDistance] = useState(0);
    const [calculatedPoints, setCalculatedPoints] = useState(0);
    
    useEffect(() => {
        let distance = 0;
        let calculatedPoints = 0;
        const degToKMFactor = 111.139;
        if (selectedLat && selectedLng) {
            distance = Math.sqrt((selectedLat - locationLat)**2 + (selectedLng - locationLng)**2) * degToKMFactor;
        
            console.log("KM: ", distance);

            calculatedPoints = 5000 * Math.E ** (-distance / 2000);

            console.log("CalculatedPoints: ", calculatedPoints);

            setPoints(points + calculatedPoints);
        } else {
            console.log("No guess, no points!")
        }

        setDistance(distance);
        setCalculatedPoints(calculatedPoints);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    

    return (
        <div>
            <button onClick={() => location.reload()} className='absolute z-50 top-4 left-4 bg-black/70 p-4 rounded-full'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
            <div className='absolute right-2 top-2 text-center z-50 bg-black/70 p-4 rounded-2xl'><span className="font-semibold">Total Points</span> <br /> <span className='font-bold text-xl'>{Math.round(points)}</span></div>
            <div className='h-[10vh] mt-4'>
                <div className="text-2xl font-bold text-center">Round {currentRound - 1}/{rounds}</div>
                <div className='text-center mt-4 text-xl'><span>{Math.round(distance)} KM</span><span className='mx-4'>-</span><span>{Math.round(calculatedPoints)} points</span></div>
            </div>
           <div className="h-[80vh]">
               <RoundEndMap location={{lat: locationLat, lng: locationLng}} selected={{selectedLat, selectedLng}}></RoundEndMap>
           </div>
           {currentRound == rounds + 1 ? (
                <button onClick={() => setView("gameEnd")} className='bottom-0 absolute h-[8.5vh] w-full'>
                    <div className='flex justify-center items-center font-bold text-4xl'>Final Summary</div>
                </button>
            ) : (
                <button onClick={() => setView("game")} className='bottom-0 absolute h-[8.5vh] w-full'>
                    <div className='flex justify-center items-center font-bold text-4xl'>Next Round</div>
                </button>
            )}
            
        </div>
    )
}

export default RoundEnd;