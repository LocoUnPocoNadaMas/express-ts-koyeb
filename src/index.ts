import express, { Request, Response } from 'express';
import { createServer } from 'node:http';
import {Server, Socket} from 'socket.io';
import path from "node:path";
require('dotenv').config();

const port = process.env.PORT || 4000

const app = express();
const server = createServer(app);
const io = new Server(server);

server.listen(port, () => {
    console.log(`Server running on ${port}`);
});

app.use('/', express.static(path.join(__dirname, 'public')))

let socketConnected = new Set()

io.on('connection', onConnected)

function onConnected(socket: Socket) {
    console.log(socket.id)
    socketConnected.add(socket.id)

    // pass an event name to get the total connected users
    io.emit('client-total', socketConnected.size)

    socket.on('disconnect', () => {
        console.log('socket disconnected', socket.id)
        socketConnected.delete(socket.id)
        // pass an event name to get the total connected users
        io.emit('client-total', socketConnected.size)
    })

    // recieves the emitted message
    socket.on('message', (data: string) => {
        socket.broadcast.emit('chat', data)
    })

    socket.on('feedback', (data: string) => {
        socket.broadcast.emit('user-typing', data)
    })
}