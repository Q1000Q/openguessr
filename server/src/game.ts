import { Server, Socket } from 'socket.io';
import { lobbies } from './lobby.js';
import getRandomCoordsFromLists from './randomLocation.js';

interface Game {
    id: string;
    lobbyId: string;

    currentRound: number;
    currentTime: number;

    location: {
        lat: number,
        lng: number
    };
    guessedLocations: Record<string, {lat: number | null, lng: number | null}>;

    points: Record<string, number>;
}

const games: Record<string, Game> = {};

export const startGame = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('startGame', async ({ lobbyId }) => {
            const lobby = lobbies[lobbyId];
            if (lobby) {
                const gameId = Buffer.from(Math.random().toString(36).substring(2, 18)).toString('base64').substring(0, 16);

                const { props: { lat, lng }} = await getRandomCoordsFromLists();

                const game: Game = {
                    id: gameId,
                    lobbyId,
                    currentRound: 1,
                    currentTime: lobby.settings.time,
                    location: { lat, lng },
                    guessedLocations: {},
                    points: {},
                };
                games[gameId] = game;

                console.log("Game started, first location:", lat, lng);
                io.to(game.lobbyId).emit('gameStarted', { gameId, game } )

                countdownGameTime(io, gameId);
            }
            
        });
    });
}
const countdownGameTime = (io: Server, gameId: string) => {
    const game = games[gameId];
    if (!game) return;

    const interval = setInterval(() => {
        game.currentTime -= 1;
        if (game.currentTime <= 0) {
            clearInterval(interval);
            io.to(game.lobbyId).emit('timeUp', { gameId });
            roundEnd(gameId, io);
        }
    }, 1000);
};


export const getGame = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('getGame', ({ gameId }) => {
            const game = games[gameId];
            if (game) {
                const lobby = lobbies[game.lobbyId];
                socket.emit('sendGame', { game, lobby } )
            }
            
        });
    });
}

const getUsername = (gameId: string, socketId: string) => {
    const game = games[gameId];
    const lobby = lobbies[game.lobbyId];
    const user = Object.keys(lobby.userSockets).find(key => lobby.userSockets[key] === socketId);
    return user;
}

export const getPoints = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('getPoints', (gameId) => {
            const game = games[gameId];
            const user = getUsername(gameId, socket.id);
            if (user) {
                const points = game.points[user];
                console.log(user, points);
                socket.emit('points', points);
            } else {
                socket.emit('error', 'You are not in the game somehow');
            }
        })
    })
}

export const guess = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('guess', ({ gameId, guessedLocation }) => {
            const game = games[gameId];
            const user = getUsername(gameId, socket.id);
            if (user) {
                game.guessedLocations[user] = guessedLocation;
                socket.emit('guessed');
                const lobby = lobbies[game.lobbyId];
                console.log(user);
                const allGuessed = lobby.users.every(user => game.guessedLocations[user]);
                if (allGuessed) {
                    io.to(game.lobbyId).emit('timeUp', { gameId });
                    roundEnd(gameId, io);
                }
            } else {
                socket.emit('error', 'You are not in the game somehow');
            }
        })
    })
}

const roundEnd = (gameId: string, io: Server) => {
    const game = games[gameId];
    const lobby = lobbies[game.lobbyId];
    const roundPoints: Record<string, number> = {};
    lobby.users.forEach(user => {
        const guessedLocation = game.guessedLocations[user];
        const location = game.location;

        let distance = 0;
        let calculatedPoints = 0;
        const degToKMFactor = 111.139;
        
        if (guessedLocation && guessedLocation.lat && guessedLocation.lng) {
            distance = Math.sqrt((guessedLocation.lat - location.lat)**2 + (guessedLocation.lng - location.lng)**2) * degToKMFactor;
        
            console.log("KM: ", distance);

            calculatedPoints = 5000 * Math.E ** (-distance / 2000);

            console.log("CalculatedPoints: ", calculatedPoints);

            roundPoints[user] = calculatedPoints;
            game.points[user] = (game.points[user] || 0) + calculatedPoints;
        } else {
            roundPoints[user] = 0;
            game.points[user] = (game.points[user] || 0) + 0;
        }
    })
    io.to(game.lobbyId).emit('roundEnd', { roundPoints, game });
}

export const nextRound = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        socket.on('nextRound', async ( gameId ) => {
            const game = games[gameId];
            if (game) {
                const lobby = lobbies[game.lobbyId];
                if (game.currentRound < lobby.settings.rounds) {
                    game.currentRound += 1;
                    const { props: { lat, lng }} = await getRandomCoordsFromLists();
                    game.location = { lat, lng };
                    io.to(game.lobbyId).emit('nextRound', game)
                } else {
                    io.to(game.lobbyId).emit('gameEnd', game)
                }
            }
        })
    })
}