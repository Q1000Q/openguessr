import { Dispatch, SetStateAction, useEffect } from 'react';

interface RoundEndProps {
    currentRound: number;
    rounds: number;
    points: number;
    setCurrentRound: Dispatch<SetStateAction<number>>;
    setView: Dispatch<SetStateAction<string>>;
    setPoints: Dispatch<SetStateAction<number>>;
}

const RoundEnd = ({currentRound, rounds, points, setCurrentRound, setView, setPoints}: RoundEndProps) => {
    useEffect(() => {
        setCurrentRound(currentRound + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div>Round: {currentRound - 1}/{rounds} - {points}</div>
           { currentRound == rounds + 1 ? (<button onClick={() => setView("gameEnd")}>Final Summary</button>) : (<button onClick={() => setView("game")}>Next Round</button>) }
        </div>
    )
}

export default RoundEnd;