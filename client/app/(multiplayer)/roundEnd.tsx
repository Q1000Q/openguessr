import { useEffect, useState } from 'react';
import RoundEndMap from './roundEndMap';
import BackButton from '../game/(backButton)';
import { Game, lobbyData } from './lobby';
import { socket } from './lobbyHandler';

interface RoundEndProps {
    lobby: lobbyData;
    game: Game;
    selected: {
        selectedLat: number | null;
        selectedLng: number | null;
    }
    roundPoints: { [key: string]: number } | null;
    points: number;
    username: string;
}

const RoundEnd = ({lobby, game, selected: { selectedLat, selectedLng }, roundPoints, points, username}: RoundEndProps) => {

    const [distance, setDistance] = useState(0);
    const currentRound = game.currentRound;
    const { lat: locationLat, lng: locationLng } = game.location;
    
    useEffect(() => {
        if (selectedLat && selectedLng) {
            const degToKMFactor = 111.139;
            const distance = Math.sqrt((selectedLat - locationLat)**2 + (selectedLng - locationLng)**2) * degToKMFactor;
            setDistance(distance);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        localStorage.removeItem('multiView');
    }, [])
    
    const handleNextRound = () => {
        socket.emit('nextRound', game.id);
    }

    return (
        <div>
            <BackButton></BackButton>
            <div className='absolute right-2 top-2 text-center z-50 bg-black/30 p-4 rounded-2xl'><span className="font-semibold">Total Points</span> <br /> <span className='font-bold text-xl'>{Math.round(points)}</span></div>
            <div className='h-[21.5vh] pt-[1.5vh] bg-gradient-to-b to-gray-800 from-black'>
                <div className="text-2xl font-bold text-center">Round {game.currentRound}/{lobby.settings.rounds}</div>
                <div className='text-center mt-4 text-xl'><span>{Math.round(distance)} KM</span><span className='mx-4'>&ndash;</span><span>{roundPoints ? Math.round(roundPoints[username]) : 0} points</span></div>
                <div className='flex mt-4'>
                    {roundPoints && Object.entries(roundPoints).map(([user, points]) => (
                        user != username ? (<div key={user} className="flex-1 text-center text-xl">
                            <span className="font-semibold">{user}</span>: <span>{Math.round(points)} points</span>
                        </div>) : ""
                    ))}
                </div>
            </div>


            <div className="h-[70vh]">
               <RoundEndMap location={{lat: locationLat, lng: locationLng}} selected={{selectedLat, selectedLng}} lobby={lobby} game={game} username={username}></RoundEndMap>
            </div>
            {currentRound == lobby.settings.rounds + 1 ? (
                <button onClick={handleNextRound} className={`bottom-0 absolute h-[8.5vh] w-full bg-gradient-to-t to-gray-900 from-black ${lobby?.users[0] != username ? "hover:cursor-not-allowed" : ""}`} disabled={lobby?.users[0] != username}>
                    <div className='flex justify-center items-center font-bold text-4xl transition-colors duration-200 hover:text-zinc-400'>Final Summary</div>
                </button>
            ) : (
                <button onClick={handleNextRound} className={`bottom-0 absolute h-[8.5vh] w-full bg-gradient-to-t to-gray-900 from-black ${lobby?.users[0] != username ? "hover:cursor-not-allowed" : ""}`} disabled={lobby?.users[0] != username}>
                    <div className='flex justify-center items-center font-bold text-4xl transition-colors duration-200 hover:text-zinc-400'>Next Round</div>
                </button>
            )}
            
        </div>
    )
}

export default RoundEnd;