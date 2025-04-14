import { NextResponse } from 'next/server';
import { Server } from 'socket.io';
import { SocketHandler } from './socketHandler';

const io = new Server({
  path: '/api/socket',
  addTrailingSlash: false,
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
    methods: ['GET', 'POST'],
  },
});

const socketHandler = new SocketHandler(io);

io.on('connection', (socket) => {
  socketHandler.handleConnection(socket).catch((error) => {
    console.error('Failed to handle socket connection:', error);
    socket.disconnect();
  });
});

export async function GET() {
  return new NextResponse(null, {
    status: 101,
    headers: {
      'Upgrade': 'websocket',
    },
  });
}