"use client"

import { useEffect, useRef, useState } from "react";
import { socket } from "./lobbyHandler";
import BackButton from "../game/(backButton)";

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

    const hasEmitted = useRef(false); // Ref to track if the event has been emitted

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedLobbyId = localStorage.getItem('lobbyId');

        if (savedLobbyId && savedUsername && !hasEmitted.current) {
            socket.emit('joinLobby', { username: savedUsername, lobbyId: savedLobbyId });
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
        socket.on('error', (err) => {
            alert(`Connection error: ${err}`);
            localStorage.setItem("mainView", "home");
            location.reload();
        });

        return () => {
            socket.off('userJoined');
            socket.off('error');
        };
    }, [lobbyId, username]);

    return (
        <div>
            <BackButton></BackButton>
            <h1 className="w-full text-center text-3xl mt-4">Lobby: {lobbyData?.id}</h1>
            <div className="flex w-full justify-center mt-[10vh]">
                <table className="border rounded w-1/4 h-[50vh] text-center text-xl font-bold">
                    <tbody>
                        <tr>
                            <td className="bg-green-600 w-1/2">{lobbyData?.users[0]}</td>
                            {lobbyData?.users[1] ? <td className="bg-blue-600 w-1/2">{lobbyData?.users[1]}</td> : ""}
                        </tr>
                        {lobbyData?.users[2] ? <tr>
                            {lobbyData?.users[2] ? <td className="bg-yellow-600 w-1/2">{lobbyData?.users[2]}</td> : ""}
                            {lobbyData?.users[3] ? <td className="bg-purple-600 w-1/2">{lobbyData?.users[3]}</td> : ""}
                        </tr> : ""}
                        {lobbyData?.users[4] ? <tr>
                            {lobbyData?.users[4] ? <td className="bg-orange-600 w-1/2">{lobbyData?.users[4]}</td> : ""}
                            {lobbyData?.users[5] ? <td className="bg-pink-600 w-1/2">{lobbyData?.users[5]}</td> : ""}
                        </tr> : ""}
                        {lobbyData?.users[6] ? <tr>
                            {lobbyData?.users[6] ? <td className="bg-teal-600 w-1/2">{lobbyData?.users[6]}</td> : ""}
                            {lobbyData?.users[7] ? <td className="bg-rose-600 w-1/2">{lobbyData?.users[7]}</td> : ""}
                        </tr> : ""}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Lobby;