"use client";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import StreetViewMap from "./(streetView)";
import { useEffect, useState } from "react";
import RoundEnd from "./(roundEnd)";
import GameEnd from "./(gameEnd)";
import GameMap from "./(gameMap)";
import getRandomCoordsFromLists from "./(randomLocation)";
import BackButton from "./(backButton)";

const render = (status: Status) => {
    if (status === Status.LOADING) return <div>Loading...</div>;
    if (status === Status.FAILURE) return <div>Error loading map</div>;
    return <div />;
};

interface GameProps {
    rounds: number;
    time: number;
    moving: boolean;
    zoomPan: boolean;
}

const Game: React.FC<GameProps> = ({ rounds: provRounds, time: provTime, moving: provMoving, zoomPan: provZoomPan }) => {
    const [rounds, setRounds] = useState(provRounds);
    const [time, setTime] = useState(provTime);
    const [moving, setMoving] = useState(provMoving);
    const [zoomPan, setZoomPan] = useState(provZoomPan);

    const [view, setView] = useState("game");

    const [currentRound, setCurrentRound] = useState(1);
    const [points, setPoints] = useState(0);

    const [locationLat, setLocationLat] = useState(0);
    const [locationLng, setLocationLng] = useState(0);

    const [selectedLat, setSelectedLat] = useState<number | null>(null);
    const [selectedLng, setSelectedLng] = useState<number | null>(null);

    const [currentTime, setCurrentTime] = useState(time);

    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        const savedView = localStorage.getItem("view");
        const savedCurrentRound = localStorage.getItem("currentRound");
        const savedPoints = localStorage.getItem("points");
        const savedLocationLat = localStorage.getItem("locationLat");
        const savedLocationLng = localStorage.getItem("locationLng");
        const savedCurrentTime = localStorage.getItem("currentTime");
        const savedRounds = localStorage.getItem("rounds");
        const savedTime = localStorage.getItem("time");
        const savedMoving = localStorage.getItem("moving");
        const savedZoomPan = localStorage.getItem("zoomPan");

        if (savedView) setView(savedView);
        if (savedCurrentRound) setCurrentRound(Number(savedCurrentRound));
        if (savedPoints) setPoints(Number(savedPoints));
        if (savedLocationLat) setLocationLat(Number(savedLocationLat));
        if (savedLocationLng) setLocationLng(Number(savedLocationLng));
        if (savedCurrentTime) setCurrentTime(Number(savedCurrentTime));
        if (savedRounds) setRounds(Number(savedRounds));
        if (savedTime) setTime(Number(savedTime));
        if (savedMoving) setMoving(savedMoving === "true");
        if (savedZoomPan) setZoomPan(savedZoomPan === "true");

        setIsDataLoaded(true);
    }, []);

    useEffect(() => {
        if (isDataLoaded) {
            localStorage.setItem("view", view);
            localStorage.setItem("currentRound", currentRound.toString());
            localStorage.setItem("points", points.toString());
            localStorage.setItem("locationLat", locationLat.toString());
            localStorage.setItem("locationLng", locationLng.toString());
            localStorage.setItem("currentTime", currentTime.toString());
            localStorage.setItem("rounds", rounds.toString());
            localStorage.setItem("time", time.toString());
            localStorage.setItem("moving", moving.toString());
            localStorage.setItem("zoomPan", zoomPan.toString());
        }
    }, [view, currentRound, points, locationLat, locationLng, currentTime, rounds, time, moving, zoomPan, isDataLoaded]);

    const fetchCoords = async () => {
        const { props: { lat, lng } } = await getRandomCoordsFromLists();
        await setLocationLat(lat);
        await setLocationLng(lng);
    };
    if (localStorage.getItem("locationLat") == "0" && localStorage.getItem("locationLng") == "0") {
        fetchCoords();
    }

    useEffect(() => {
        if (currentTime <= 0) {
            setCurrentTime(time);
            setView("roundEnd");
        }
        if (view == "game") {
            const intervalId = setInterval(() => {
                setCurrentTime((prevTime) => prevTime - 1);
            }, 1000)
            return () => clearInterval(intervalId);
        } else {
            setCurrentTime(time);
        }
    }, [currentTime, currentRound, rounds, time, view]);

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
                    setView("roundEnd");
                }
            }
        };

        window.addEventListener("keyup", handleKeyUp);

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [isMapSelected, selectedLat, selectedLng]);

    return view == "game" ? (
        <div
            onClick={() => {
                setIsMapSelected(false);
            }}
            className="h-[100vh] w-full"
        >
            <BackButton></BackButton>
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
                    ></GameMap>
                </Wrapper>
                <button
                    onClick={() => setView("roundEnd")}
                    className="bottom-0 absolute right-0 z-[60] w-full h-[5vh] bg-black"
                >
                    Guess
                </button>
            </div>
        </div>
    ) : view == "roundEnd" ? (
        <RoundEnd
            currentRound={currentRound}
            rounds={rounds}
            points={points}
            setView={setView}
            setPoints={setPoints}
            selectedLocation={{ selectedLat, selectedLng }}
            location={{ locationLat, locationLng }}
            time={time}
        />
    ) : (
        <GameEnd points={points} rounds={rounds} />
    );
};

export default Game;
