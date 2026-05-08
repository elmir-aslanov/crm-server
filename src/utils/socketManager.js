import { Server } from 'socket.io';

let io = null;

export const initSocket = (httpServer) => {
    const origins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
        : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'];

    io = new Server(httpServer, {
        cors: { origin: origins, credentials: true },
    });

    io.on('connection', (socket) => {
        const userId = socket.handshake.auth?.userId;
        if (userId) {
            socket.join(userId.toString());
        }
        socket.on('disconnect', () => {});
    });

    return io;
};

export const emitToUser = (userId, event, data) => {
    if (!io) return;
    io.to(userId.toString()).emit(event, data);
};

export const getIO = () => io;
