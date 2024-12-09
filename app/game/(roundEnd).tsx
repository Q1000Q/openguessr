import { Dispatch, SetStateAction, useEffect } from 'react';

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

    useEffect(() => {
        let distance = 0;
        const degToKMFactor = 111.139;
        if (selectedLat && selectedLng) {
            distance = Math.sqrt((selectedLat - locationLat)**2 + (selectedLng - locationLng)**2) * degToKMFactor;
        
            console.log("KM: ", distance);

            const calculatedPoints = 5000 * Math.E ** (-distance / 2000);

            console.log("CalculatedPoints: ", calculatedPoints);

            setPoints(points + calculatedPoints);
        } else {
            console.log("No guess, no points!")
        }

    }, [locationLat, locationLng, selectedLat, selectedLng])
    

    return (
        <div>
            <div>Round: {currentRound - 1}/{rounds} - {points}</div>
           { currentRound == rounds + 1 ? (<button onClick={() => setView("gameEnd")}>Final Summary</button>) : (<button onClick={() => setView("game")}>Next Round</button>) }
        </div>
    )
}

export default RoundEnd;