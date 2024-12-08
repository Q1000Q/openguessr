interface GameEndProps {
    points: number;
}

const GameEnd = ({points}: GameEndProps) => {
    return (
        <div>
            <h1>Game End!!!</h1>
            <h2>Points: {points}</h2>
        </div>
    )
}

export default GameEnd;