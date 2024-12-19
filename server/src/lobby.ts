import { Router } from 'express';
import { Server, Socket } from 'socket.io';

const router = Router();

interface Lobby {
    id: string;
    users: string[];
    settings: {
        rounds: number;
        time: number;
        moving: boolean;
        zoomPan: boolean;
    };
    userSockets: Record<string, string>; // Add this to store user socket ids
}

const lobbies: Record<string, Lobby> = {};

export const joinLobby = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('joinLobby', ({ username, lobbyId }) => {
            const lobby = lobbies[lobbyId];
            if (lobby) {
                lobby.userSockets[username] = socket.id;
                if (!lobby.users.includes(username)) {
                    lobby.users.push(username);
                    socket.join(lobbyId);
                    io.to(lobbyId).emit('userJoined', { username, lobby: { ...lobby, userSockets: undefined } });
                    console.log(`${username} joined lobby: ${lobbyId}`);
                } else {
                    socket.join(lobbyId);
                    io.to(lobbyId).emit('userJoined', { username, lobby: { ...lobby, userSockets: undefined } });
                    console.log(`${username} rejoined lobby: ${lobbyId}`);
                }
            } else {
                socket.emit('error', 'Lobby not found');
            }
        });
    });
}

export const kickUser = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('kickUser', ({ username, lobbyId }) => {
            const lobby = lobbies[lobbyId];
            if (lobby) {
                console.log(socket.id);
                if (lobby.userSockets[lobby.users[0]] === socket.id) {
                    lobby.users = lobby.users.filter(user => user !== username);
                    io.to(lobbyId).emit('userKicked', { username, lobby: { ...lobby, userSockets: undefined }  });
                    socket.leave(lobbyId);
                    console.log(`${username} was kicked from lobby: ${lobbyId}`);
                } else {
                    socket.emit('error', 'Only the lobby creator can kick players');
                }
            } else {
                socket.emit('error', 'Lobby not found');
            }
        })
    });
}

export const settingsUpdate = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('settingsUpdate', ({ lobbyId, rounds, time, moving, zoomPan }) => {
            const lobby = lobbies[lobbyId];
            if (lobby) {
                lobby.settings = { rounds, time, moving, zoomPan };
                socket.join(lobbyId);
                io.to(lobbyId).emit('settingUpdated', { ...lobby.settings, rounds, time, moving, zoomPan });

            } else {
                socket.emit('error', 'Lobby not found');
            }
        })
    });
}

router.put("/create", async (req, res) => {
    const { rounds, time, moving, zoomPan } = req.body;
    const lobbyId = Math.random().toString(16).substr(2, 6).toUpperCase();
    lobbies[lobbyId] = { id: lobbyId, users: [], settings: { rounds, time, moving, zoomPan }, userSockets: {} };
    console.log(`Created lobby: ${lobbyId} (Rounds: ${rounds}; Time: ${time}; Moving: ${moving}; ZoomPan: ${zoomPan})`);
    res.send({ lobbyId });
})

export default router;