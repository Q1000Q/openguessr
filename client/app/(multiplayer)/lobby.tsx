"use client"

import { useEffect, useRef, useState } from "react";
import { socket } from "./lobbyHandler";
import BackButton from "../game/(backButton)";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import getRandomCoordsFromLists from "../game/(randomLocation)";

interface lobbyData {
    id: string;
    users: string[];
    settings: {
        rounds: number;
        time: number;
        moving: boolean;
        zoomPan: boolean;
    }
}

const Lobby = ({username, lobbyId}: {username: string, lobbyId: string}) => {

    const [lobbyData, setLobbyData] = useState<lobbyData | null>(null);

    const [currentLobbyId, setCurrentlobbyId] = useState(lobbyId);

    const hasEmitted = useRef(false); // Ref to track if the event has been emitted

    useEffect(() => {
        const savedLobbyId = localStorage.getItem('lobbyId');

        if (savedLobbyId) {
            setCurrentlobbyId(savedLobbyId);
        }

        if (savedLobbyId &&!hasEmitted.current) {
            socket.emit('joinLobby', { username, lobbyId: savedLobbyId });
            hasEmitted.current = true; // Set the ref to true after emitting
        } else if (!hasEmitted.current) {
            socket.emit('joinLobby', { username, lobbyId });
            hasEmitted.current = true;
            localStorage.setItem('username', username);
            localStorage.setItem('lobbyId', lobbyId);
        }

        socket.on('userJoined', (data) => {
            setLobbyData(data.lobby);
        });
        socket.on('userKicked', (data) => {
            if (data.username === username) {
                alert("You have been kicked from the lobby");
                localStorage.setItem("mainView", "home");
            }
            location.reload();
            setLobbyData(data.lobby);
        })
        socket.on('settingUpdated', (data) => {
            setLobbyData((prevData) => prevData ? { ...prevData, settings: data } : null);
        })

        socket.on('error', (err) => {
            alert(`Connection error: ${err}`);
            if (err == "Lobby not found") {
                localStorage.setItem("mainView", "home");
                location.reload();
            }
        });

        return () => {
            socket.off('userJoined');
            socket.off('error');
            socket.off('userKicked');
        };
    }, [lobbyId, username]);

    const kickPlayerHandler = (usernameToKick: string) => {
        socket.emit('kickUser', { lobbyId: currentLobbyId, username: usernameToKick });
    }


    const updateSettings = (newRounds = lobbyData?.settings.rounds, newTime = lobbyData?.settings.time, newMoving = lobbyData?.settings.moving, newZoomPan = lobbyData?.settings.zoomPan) => {
        socket.emit('settingsUpdate', { lobbyId: currentLobbyId, rounds: newRounds, time: newTime, moving: newMoving, zoomPan: newZoomPan });
    }

    const decreseRounds = async () => {
        if (lobbyData && lobbyData.settings.rounds > 1) {
          updateSettings(lobbyData.settings.rounds - 1);
        }
      }
      
    const increseRounds = async () => {
        if (lobbyData && lobbyData.settings.rounds < 100) {
            updateSettings(lobbyData.settings.rounds + 1);
        }
    }
    
    const decreseTime = async () => {
        if (lobbyData && lobbyData.settings.time > 30) {
            const time = lobbyData.settings.time;
            updateSettings(lobbyData.settings.rounds, time - (time%30 == 0 ? 30 : time%30));
        }
    }

    const increseTime = async () => {
        if (lobbyData && lobbyData.settings.time < 3000) {
            const time = lobbyData.settings.time;
            updateSettings(lobbyData.settings.rounds, time + 30 - time%30);
        }
    }

    const handleMoving = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked === true) {
            updateSettings(lobbyData?.settings.rounds, lobbyData?.settings.time, event.target.checked, true);
        } else {
            updateSettings(lobbyData?.settings.rounds, lobbyData?.settings.time, event.target.checked);
        }
    };

    const handleZoomPan = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateSettings(lobbyData?.settings.rounds, lobbyData?.settings.time, lobbyData?.settings.moving, event.target.checked);
    };


    const [multiView, setMultiView] = useState<string>("lobby");

    const handlePlayGame = async () => {
        const { props: { lat, lng } } = await getRandomCoordsFromLists();
        socket.emit('startGame', { location: { lat, lng } });
    }

    return (
        <div>
            <BackButton></BackButton>
            <h1 className="w-full text-center text-3xl mt-4">Lobby: {lobbyData?.id}</h1>
            {/* Players List */}
            <div className="flex w-full justify-center mt-[6vh]">
                <table className="border rounded w-1/2 h-[55vh] min-h-80 text-center text-xl font-bold">
                    <tbody>
                        <tr>
                            <td className="bg-green-600 w-1/2">
                                <div>{lobbyData?.users[0]}</div>
                            </td>
                            {lobbyData?.users[1] ? <td className="bg-blue-600 w-1/2">
                                <div>{lobbyData?.users[1]}</div>
                                {lobbyData?.users[0] === username ? <button onClick={() => kickPlayerHandler(lobbyData?.users[1])} className="bg-red-600 px-4 rounded mt-2">KICK</button> : ""}
                            </td> : ""}
                        </tr>
                        {lobbyData?.users[2] ? <tr>
                            {lobbyData?.users[2] ? <td className="bg-yellow-600 w-1/2">
                                <div>{lobbyData?.users[2]}</div>
                                {lobbyData?.users[0] === username ? <button onClick={() => kickPlayerHandler(lobbyData?.users[2])} className="bg-red-600 px-4 rounded">KICK</button> : ""}
                            </td> : ""}
                            {lobbyData?.users[3] ? <td className="bg-purple-600 w-1/2">
                                <div>{lobbyData?.users[3]}</div>
                                {lobbyData?.users[0] === username ? <button onClick={() => kickPlayerHandler(lobbyData?.users[3])} className="bg-red-600 px-4 rounded">KICK</button> : ""}
                            </td> : ""}
                        </tr> : ""}
                        {lobbyData?.users[4] ? <tr>
                            {lobbyData?.users[4] ? <td className="bg-orange-600 w-1/2">
                                <div>{lobbyData?.users[4]}</div>
                                {lobbyData?.users[0] === username ? <button onClick={() => kickPlayerHandler(lobbyData?.users[4])} className="bg-red-600 px-4 rounded">KICK</button> : ""}
                            </td> : ""}
                            {lobbyData?.users[5] ? <td className="bg-pink-600 w-1/2">
                                <div>{lobbyData?.users[5]}</div>
                                {lobbyData?.users[0] === username ? <button onClick={() => kickPlayerHandler(lobbyData?.users[5])} className="bg-red-600 px-4 rounded">KICK</button> : ""}
                            </td> : ""}
                        </tr> : ""}
                        {lobbyData?.users[6] ? <tr>
                            {lobbyData?.users[6] ? <td className="bg-teal-600 w-1/2">
                                <div>{lobbyData?.users[6]}</div>
                                {lobbyData?.users[0] === username ? <button onClick={() => kickPlayerHandler(lobbyData?.users[6])} className="bg-red-600 px-4 rounded">KICK</button> : ""}
                            </td> : ""}
                            {lobbyData?.users[7] ? <td className="bg-rose-600 w-1/2">
                                <div>{lobbyData?.users[7]}</div>
                                {lobbyData?.users[0] === username ? <button onClick={() => kickPlayerHandler(lobbyData?.users[7])} className="bg-red-600 px-4 rounded">KICK</button> : ""}
                            </td> : ""}
                        </tr> : ""}
                    </tbody>
                </table>
            </div>
            
            {/* Settings */}
            <div className="flex justify-center mt-[14vh] mb-[4vh]">
                <div className="grid grid-cols-4 gap-6 w-10/12">
                   <div className="grid grid-cols-[1fr_6fr_1fr] grid-rows-[2fr_3fr] bg-zinc-600 rounded">
                        <h2 className="text-center bg-zinc-600 rounded-t col-span-3">Rounds</h2>
                        <button className="bg-zinc-600 rounded-bl hover:bg-zinc-800 transition-colors duration-200" onClick={decreseRounds} disabled={lobbyData?.users[0] != username}>-</button>
                        <input onChange={(e) => { updateSettings(Number(e.target.value)) }} type="number" name="rounds" id="rounds" value={lobbyData?.settings.rounds ?? 5} className="text-black text-center w-full rounded-t-sm" disabled={lobbyData?.users[0] != username} />
                        <button className="bg-zinc-600 rounded-br hover:bg-zinc-800 transition-colors duration-200" onClick={increseRounds} disabled={lobbyData?.users[0] != username}>+</button>
                    </div>
                    <div className="grid grid-cols-[1fr_6fr_1fr] grid-rows-[2fr_3fr] bg-zinc-600 rounded">
                        <h2 className="text-center bg-zinc-600 rounded-t col-span-3">Time Per Round (seconds)</h2>
                        <button className="bg-zinc-600 rounded-bl hover:bg-zinc-800 transition-colors duration-200" onClick={decreseTime} disabled={lobbyData?.users[0] != username}>-</button>
                        <input onChange={(e) => { updateSettings(lobbyData?.settings.rounds, Number(e.target.value)); }} type="number" name="time" id="time" value={lobbyData?.settings.time ?? 180} className="text-black text-center w-full rounded-t-sm" disabled={lobbyData?.users[0] != username} />
                        <button className="bg-zinc-600 rounded-br hover:bg-zinc-800 transition-colors duration-200" onClick={increseTime} disabled={lobbyData?.users[0] != username}>+</button>
                    </div>
                    <div className="bg-zinc-600 rounded flex justify-center items-center">
                        <div className="scale-125">
                            <FormGroup>
                                <FormControlLabel control={<Switch checked={lobbyData?.settings.moving ?? true} onChange={handleMoving} />} label="Moving" disabled={lobbyData?.users[0] != username} />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="bg-zinc-600 rounded flex justify-center items-center">
                        <div className="scale-125">
                            <FormGroup>
                                <FormControlLabel 
                                    control={<Switch checked={lobbyData?.settings.zoomPan ?? true} onChange={handleZoomPan} disabled={(lobbyData?.settings.moving ?? false) || lobbyData?.users[0] != username} />} 
                                    label="Zooming / Panning" 
                                />
                            </FormGroup>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={() => {}} className={`bottom-0 h-[8.5vh] min-h-12 w-full bg-zinc-600 transition-colors duration-200 ${lobbyData?.users[0] != username ? "hover:cursor-not-allowed": "hover:bg-zinc-800"}`} disabled={lobbyData?.users[0] != username} >
                <div onClick={handlePlayGame} className='flex justify-center items-center font-bold text-4xl'>Start Game</div>
            </button>
        </div>
    )
}

export default Lobby;