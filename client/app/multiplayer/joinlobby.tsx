import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your server URL

const JoinLobby: React.FC = () => {
    const [lobbyId, setLobbyId] = useState('');
    const [username, setUsername] = useState('');
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        socket.on('joinSuccess', () => {
            setJoined(true);
        });

        return () => {
            socket.off('joinSuccess');
        };
    }, []);

    const handleJoinLobby = () => {
        if (lobbyId && username) {
            socket.emit('joinLobby', { lobbyId, username });
        }
    };

    return (
        <div>
            {!joined ? (
                <div>
                    <h2>Join Lobby</h2>
                    <input
                        type="text"
                        placeholder="Lobby ID"
                        value={lobbyId}
                        onChange={(e) => setLobbyId(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleJoinLobby}>Join</button>
                </div>
            ) : (
                <h2>Successfully joined the lobby!</h2>
            )}
        </div>
    );
};

export default JoinLobby;