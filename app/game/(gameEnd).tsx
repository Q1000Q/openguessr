interface GameEndProps {
    points: number;
    rounds: number;
}

const GameEnd = ({points, rounds}: GameEndProps) => {
    return (
        <div>
            <button onClick={() => location.reload()} className='absolute z-50 top-4 left-4 bg-black/70 p-4 rounded-full'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
            <div className="flex w-full h-[100vh] justify-center items-center flex-col">
                <h1 className="font-bold text-6xl">Game End!</h1>
                <h2 className="font-bold text-3xl">Total Points: {Math.round(points)} / {rounds * 5000}</h2>
                <button onClick={() => location.reload()} className="mt-10 bg-zinc-600 py-4 px-8 rounded-lg text-lg font-semibold hover:bg-zinc-800 transition-colors duration-200">Go back to main menu</button>
            </div>
        </div>
    )
}

export default GameEnd;