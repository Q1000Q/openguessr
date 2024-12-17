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
    }
}

const lobbies: Record<string, Lobby> = {};

export const joinLobby = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('joinLobby', ({ username, lobbyId }) => {
            const lobby = lobbies[lobbyId];
            if (lobby) {
                if (!lobby.users.includes(username)) {
                    lobby.users.push(username);
                    socket.join(lobbyId);
                    io.to(lobbyId).emit('userJoined', { username, lobby });
                    console.log(`${username} joined lobby: ${lobbyId}`);
                } else {
                    socket.join(lobbyId);
                    io.to(lobbyId).emit('userJoined', { username, lobby });
                    console.log(`${username} rejoined lobby: ${lobbyId}`);
                }
            } else {
                socket.emit('error', 'Lobby not found');
            }
        });
    });
}

router.put("/create", async (req, res) => {
    const { rounds, time, moving, zoomPan } = req.body;
    const lobbyId = Math.random().toString(16).substr(2, 6).toUpperCase();
    lobbies[lobbyId] = { id: lobbyId, users: [], settings: {rounds, time, moving, zoomPan} };
    console.log(`Created lobby: ${lobbyId} (Rounds: ${rounds}; Time: ${time}; Moving: ${moving}; ZoomPan: ${zoomPan})`);
    res.send({ lobbyId });
})

export default router;