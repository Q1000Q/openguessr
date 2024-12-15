import io from 'socket.io-client';

export const socket = io('http://localhost:3001'); // Replace with your server URL

export const JoinLobby = (username: string, lobbyId: string) => {
    if (lobbyId && username) {
        socket.emit('joinLobby', { username, lobbyId });
    }
};

export const CreateLobby = (rounds: number, time: number, moving: boolean, zoomPan: boolean) => {
    const response = fetch("http://localhost:3001/lobby/create", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rounds, time, moving, zoomPan }),
    });
    return response.then(res => res.json()).then(data => data.lobbyId);
}

export const DisconnectLobby = () => {
    socket.off('joinSuccess');
}