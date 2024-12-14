import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import RoundEndMap from './(roundEndMap)';
import BackButton from './(backButton)';

interface RoundEndProps {
    currentRound: number;
    rounds: number;
    points: number;
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

const RoundEnd = ({currentRound, rounds, points, setView, setPoints, selectedLocation: {selectedLat, selectedLng}, location: {locationLat, locationLng}}: RoundEndProps) => {

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

    const handleNextRound = () => {
        const newCurrentRound = (currentRound + 1).toString()
        localStorage.setItem("currentRound", newCurrentRound.toString());

        localStorage.removeItem("locationLat");
        localStorage.removeItem("locationLng");
        localStorage.removeItem("currentTime");
        
        localStorage.setItem("view", "game");
        setView("game");
    }
    

    return (
        <div>
            <BackButton></BackButton>
            <div className='absolute right-2 top-2 text-center z-50 bg-black/30 p-4 rounded-2xl'><span className="font-semibold">Total Points</span> <br /> <span className='font-bold text-xl'>{Math.round(points)}</span></div>
            <div className='h-[11.5vh] pt-[1.5vh] bg-gradient-to-b to-gray-800 from-black'>
                <div className="text-2xl font-bold text-center">Round {currentRound - 1}/{rounds}</div>
                <div className='text-center mt-4 text-xl'><span>{Math.round(distance)} KM</span><span className='mx-4'>&ndash;</span><span>{Math.round(calculatedPoints)} points</span></div>
            </div>
           <div className="h-[80vh]">
               <RoundEndMap location={{lat: locationLat, lng: locationLng}} selected={{selectedLat, selectedLng}}></RoundEndMap>
           </div>
           {currentRound == rounds + 1 ? (
                <button onClick={() => setView("gameEnd")} className='bottom-0 absolute h-[8.5vh] w-full bg-gradient-to-t to-gray-900 from-black'>
                    <div className='flex justify-center items-center font-bold text-4xl transition-colors duration-200 hover:text-zinc-400'>Final Summary</div>
                </button>
            ) : (
                <button onClick={handleNextRound} className='bottom-0 absolute h-[8.5vh] w-full bg-gradient-to-t to-gray-900 from-black'>
                    <div className='flex justify-center items-center font-bold text-4xl transition-colors duration-200 hover:text-zinc-400'>Next Round</div>
                </button>
            )}
            
        </div>
    )
}

export default RoundEnd;