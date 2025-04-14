import { Server, Socket } from 'socket.io';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface MessagePayload {
  content: string;
}

export class SocketHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async handleConnection(socket: Socket) {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        throw new Error('Unauthorized');
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          partnerRelation: true,
        },
      });

      if (!user || !user.partnerRelation) {
        throw new Error('No partner relationship found');
      }

      const roomId = user.partnerRelation.id;
      await this.joinRoom(socket, roomId);
      await this.setupMessageHandlers(socket, user.id, roomId);
      await this.sendMessageHistory(socket, user.id, roomId);
    } catch (error) {
      console.error('Connection error:', error);
      socket.disconnect();
    }
  }

  private async joinRoom(socket: Socket, roomId: string) {
    await socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  }

  private async setupMessageHandlers(socket: Socket, userId: string, roomId: string) {
    socket.on('send_message', async (data: MessagePayload) => {
      try {
        const { content } = data;
        if (!content.trim()) {
          throw new Error('Message content cannot be empty');
        }

        const partnerRelation = await prisma.partnerRelation.findUnique({
          where: { id: roomId },
        });

        if (!partnerRelation) {
          throw new Error('Partner relationship not found');
        }

        const partnerId = partnerRelation.user1Id === userId
          ? partnerRelation.user2Id
          : partnerRelation.user1Id;

        const message = await prisma.message.create({
          data: {
            content,
            senderId: userId,
            receiverId: partnerId,
            partnerRelationId: roomId,
          },
        });

        this.io.to(roomId).emit('receive_message', {
          id: message.id,
          content: message.content,
          sender: userId,
          timestamp: message.createdAt,
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from room: ${roomId}`);
    });
  }

  private async sendMessageHistory(socket: Socket, userId: string, roomId: string) {
    try {
      const messages = await prisma.message.findMany({
        where: {
          partnerRelationId: roomId,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: 50, // Limit to last 50 messages
      });

      socket.emit('message_history', messages.map((message: { id: any; content: any; senderId: any; createdAt: any; }) => ({
        id: message.id,
        content: message.content,
        sender: message.senderId,
        timestamp: message.createdAt,
      })));
    } catch (error) {
      console.error('Error fetching message history:', error);
      socket.emit('error', { message: 'Failed to load message history' });
    }
  }
}