import { Server, Socket } from 'socket.io';
import { lobbies } from './lobby';

interface game {
    rounds: number;
    currentRound: number;

    time: number;
    currentTime: number;

    moving: boolean;
    zoomPan: boolean;
    location: {
        lat: number,
        lng: number
    };
    guessedLocations: Record<string, {lat: number, lng: number}>;
    players: string[];
    points: Record<string, number>;
    playersSockets: Record<string, string>;
}

export const startGame = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('startGame', ({ location: {lat, lng} }) => {
            console.log("Game started, first location:", lat, lng);
        });
    });
}