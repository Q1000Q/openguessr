import { Server, Socket } from 'socket.io';

interface Lobby {
    id: string;
    users: string[];
}

const lobbies: Record<string, Lobby> = {};

export function createLobby(io: Server, lobbyId: string) {
    if (!lobbies[lobbyId]) {
        lobbies[lobbyId] = { id: lobbyId, users: [] };
    }

    io.on('connection', (socket: Socket) => {
        socket.on('joinLobby', (userId: string) => {
            if (lobbies[lobbyId]) {
                lobbies[lobbyId].users.push(userId);
                socket.join(lobbyId);
                io.to(lobbyId).emit('userJoined', userId);
                console.log(`User ${userId} joined lobby ${lobbyId}`);
            }
        });

        socket.on('leaveLobby', (userId: string) => {
            if (lobbies[lobbyId]) {
                lobbies[lobbyId].users = lobbies[lobbyId].users.filter(id => id !== userId);
                socket.leave(lobbyId);
                io.to(lobbyId).emit('userLeft', userId);
                console.log(`User ${userId} left lobby ${lobbyId}`);
            }
        });

        socket.on('disconnect', () => {
            for (const lobby of Object.values(lobbies)) {
                lobby.users = lobby.users.filter(id => id !== socket.id);
                io.to(lobby.id).emit('userLeft', socket.id);
            }
            console.log(`User ${socket.id} disconnected`);
        });
    });
}