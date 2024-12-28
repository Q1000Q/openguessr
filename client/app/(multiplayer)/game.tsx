"use client";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import StreetViewMap from "../game/(streetView)";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Game as GameType } from "./lobby";
import RoundEnd from "./roundEnd";
import GameEnd from "./gameEnd";
import GameMap from "./gameMap";
import { Game as GameData, lobbyData } from "./lobby";
import { socket } from "./lobbyHandler";
import { userMarkers } from "./lobby";

const render = (status: Status) => {
    if (status === Status.LOADING) return <div>Loading...</div>;
    if (status === Status.FAILURE) return <div>Error loading map</div>;
    return <div />;
};

interface GameProps {
    lobby: lobbyData;
    game: GameData;
    setGame: Dispatch<SetStateAction<GameType | null>>;
    username: string;
}

const Game: React.FC<GameProps> = ({ lobby, game, setGame, username }) => {

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "Are you sure you want to leave? Your progress will be lost.";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const time = game.currentTime - 1 || 0;
    const moving = lobby.settings.moving;
    const zoomPan = lobby.settings.zoomPan;
    const { lat: locationLat, lng: locationLng} = game.location;

    const [view, setView] = useState("game");

    const [points, setPoints] = useState<number>(0);

    const [selectedLat, setSelectedLat] = useState<number | null>(null);
    const [selectedLng, setSelectedLng] = useState<number | null>(null);

    const [currentTime, setCurrentTime] = useState(time);

    const [guessed, setGuessed] = useState(false);

    const [roundPoints, setRoundPoints] = useState<{ [key: string]: number } | null>(null);

    useEffect(() => {
        socket.emit('getPoints', game.id);

        socket.on('points', (points) => {
            if (points == null) {
                setPoints(0);
            } else {
                setPoints(points);
            }
        })
    }, [game.id])

    useEffect(() => {
        const handleTimeUp = () => {
            if (!guessed) {
                socket.emit('guess', { gameId: game.id, guessedLocation: { lat: selectedLat, lng: selectedLng } });
                setGuessed(true);
            }
            setCurrentTime(time);
            setView("roundEnd");
        };

        socket.on('timeUp', handleTimeUp);

        socket.on('roundEnd', (data) => {
            const { roundPoints, game } = data;
            setRoundPoints(roundPoints);
            setGame(game);
            setPoints(game.points[username]);
        })

        socket.on('nextRound', (game) => {
            setGame(game);
            setView("game");
        })
        socket.on('gameEnd', (game) => {
            setGame(game);
            setView("gameEnd");
        })

        return () => {
            socket.off('timeUp', handleTimeUp);
        };
    }, [game.id, guessed, selectedLat, selectedLng, setGame, time, username]);

    useEffect(() => {
        if (view == "game") {
            const intervalId = setInterval(() => {
                setCurrentTime((prevTime) => prevTime > 0 ? prevTime - 1 : 0);
            }, 1000)
            return () => clearInterval(intervalId);
        }
    }, [game.id, time, view]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const [isMapSelected, setIsMapSelected] = useState(false);

    useEffect(() => {
        const handleKeyUp = (event: { key: string; keyCode: number }) => {
            if (event.key === " " || event.keyCode === 32) {
                if (isMapSelected && (selectedLat || selectedLng)) {
                    socket.emit('guess', { gameId: game.id, guessedLocation: { lat: selectedLat, lng: selectedLng } });
                    setGuessed(true);
                }
            }
        };

        window.addEventListener("keyup", handleKeyUp);

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [game.id, isMapSelected, selectedLat, selectedLng]);

    const handleGuess = () => {
        if (!guessed) {
            socket.emit('guess', { gameId: game.id, guessedLocation: { lat: selectedLat, lng: selectedLng } });
            setGuessed(true);
        }

    }

    return view == "game" ? (
        <div
            onClick={() => {
                setIsMapSelected(false);
            }}
            className="h-[100vh] w-full"
        >
            <div className="absolute right-2 top-2 text-center z-50 bg-black/70 p-4 rounded-2xl">
                <span className="font-semibold">Total Points</span> <br />{" "}
                <span className="font-bold text-xl">{Math.round(points)}</span>
            </div>
            <div className="absolute top-2 z-50 left-1/2 transform -translate-x-1/2 text-3xl bg-black/70 py-4 px-16 rounded-xl">
                <strong>{`${Math.floor(currentTime / 60)
                    .toString()
                    .padStart(2, "0")}:${(currentTime % 60)
                    .toString()
                    .padStart(2, "0")}`}</strong>
            </div>
            <Wrapper
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                render={render}
            >
                <StreetViewMap
                    lat={locationLat}
                    lng={locationLng}
                    moving={moving}
                    zoomPan={zoomPan}
                />
            </Wrapper>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setIsMapSelected(true);
                }}
                className="map-container absolute z-50 right-0 bottom-0 h-[35vh] w-1/4 hover:h-[60vh] hover:w-1/2 transition-all"
            >
                <Wrapper
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                    render={render}
                >
                    <GameMap
                        selected={{
                            setSelectedLatGame: setSelectedLat,
                            setSelectedLngGame: setSelectedLng,
                        }}
                    markerURL={userMarkers[lobby.users.findIndex(user => user === username) as keyof typeof userMarkers]}
                    ></GameMap>
                </Wrapper>
                <button
                    onClick={handleGuess}
                    className="bottom-0 absolute right-0 z-[60] w-full h-[5vh] bg-black"
                >
                    {guessed ? "Already Guessed" : "Guess"}
                </button>
            </div>
        </div>
    ) : view == "roundEnd" ? (
        <RoundEnd
            lobby={lobby}
            game={game}
            selected={{selectedLat, selectedLng}}
            roundPoints={roundPoints}
            points={points}
            username={username}
        />
    ) : (
        <GameEnd game={game} lobby={lobby} username={username} />
    );
};

export default Game;
