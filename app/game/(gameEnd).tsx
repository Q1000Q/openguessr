import { useEffect } from 'react';
import BackButton from './(backButton)';

interface GameEndProps {
    points: number;
    rounds: number;
}

const GameEnd = ({points, rounds}: GameEndProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem("mainView", "home");
            location.reload();
        }, 30000);

        return () => clearTimeout(timer);
    }, []);

    const handleMainMenuButton = () => {
        localStorage.setItem("mainView", "home");
        location.reload();
    }

    return (
        <div>
            <BackButton></BackButton>
            <div className="flex w-full h-[100vh] justify-center items-center flex-col">
                <h1 className="font-bold text-6xl">Game End!</h1>
                <h2 className="font-bold text-3xl mt-4">Total Points: {Math.round(points)} / {rounds * 5000} <span className="font-normal text-gray-400">({Math.round(points / (rounds * 5000) * 100)}%)</span></h2>
                <button onClick={handleMainMenuButton} className="mt-10 bg-zinc-600 py-4 px-8 rounded-lg text-lg font-semibold hover:bg-zinc-800 transition-colors duration-200">Go back to main menu</button>
            </div>
        </div>
    )
}

export default GameEnd;