"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const node_path_1 = __importDefault(require("node:path"));
require('dotenv').config();
const port = process.env.PORT || 4000;
const host = process.env.HOST;
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server);
server.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});
app.use('/', express_1.default.static(node_path_1.default.join(__dirname, 'public')));
//app.use('/', express.static('public'))
app.get('/uwu', (req, res) => {
    res.send("ewe");
});
let socketConnected = new Set();
io.on('connection', onConnected);
function onConnected(socket) {
    console.log(socket.id);
    socketConnected.add(socket.id);
    // pass an event name to get the total connected users
    io.emit('client-total', socketConnected.size);
    socket.on('disconnect', () => {
        console.log('socket disconnected', socket.id);
        socketConnected.delete(socket.id);
        // pass an event name to get the total connected users
        io.emit('client-total', socketConnected.size);
    });
    // recieves the emitted message
    socket.on('message', (data) => {
        socket.broadcast.emit('chat', data);
    });
    socket.on('feedback', (data) => {
        socket.broadcast.emit('user-typing', data);
    });
}
