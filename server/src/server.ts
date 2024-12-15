import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import lobbyRouter from "./lobby"
import { joinLobby } from './lobby';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your client URL
        methods: ['GET', 'POST']
    }
});

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/lobby", lobbyRouter);
joinLobby(io);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});