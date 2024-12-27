import { Game, lobbyData } from './lobby';

interface GameEndProps {
    lobby: lobbyData;
    game: Game;
    username: string;
}

const GameEnd = ({lobby, game, username}: GameEndProps) => {

    const points = Object.fromEntries(
        Object.entries(game.points).sort(([, a], [, b]) => b - a)
    );


    const handleBackToLobby = () => {
        localStorage.setItem("multiView", "lobby");
        location.reload();
    }

    return (
        <div>
            <button onClick={handleBackToLobby} className='absolute z-50 top-4 left-4 bg-black/70 p-4 rounded-full'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
            <div className="flex w-full h-[100vh] justify-center items-center flex-col">
                <h1 className="font-bold text-6xl">Game End!</h1>
                <h2 className="font-bold text-3xl mt-4">Your Points: {Math.round(points[username])} / {lobby.settings.rounds * 5000} <span className="font-normal text-gray-400">({Math.round(points[username] / (lobby.settings.rounds * 5000) * 100)}%)</span></h2>
                <div className='mt-10'>
                    {points && Object.entries(points).map(([user, points]) => (
                        user != username ? (<div key={user} className="flex-1 text-center text-xl">
                            <span className="font-semibold">{user}</span>: <span>{Math.round(points)} points</span>
                        </div>): ""
                    ))}
                </div>
                <button onClick={handleBackToLobby} className="mt-10 bg-zinc-600 py-4 px-8 rounded-lg text-lg font-semibold hover:bg-zinc-800 transition-colors duration-200">Go back to Lobby</button>
            </div>
        </div>
    )
}

export default GameEnd;