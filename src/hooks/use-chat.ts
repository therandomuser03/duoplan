import { useEffect, useCallback, useState, Dispatch, SetStateAction } from 'react';
import { io, Socket } from 'socket.io-client';

declare global {
  interface Window {
    __heartbeatInterval?: NodeJS.Timeout;
  }
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
}

interface UseChatProps {
  onReceiveMessage: Dispatch<SetStateAction<Message[]>>;
}

interface ChatState {
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
}

export function useChat({ onReceiveMessage }: UseChatProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<ChatState>({
    isConnecting: false,
    isConnected: false,
    error: null,
  });

  const connect = useCallback(() => {
    if (!socket && !state.isConnecting) {
      setState(prev => ({ ...prev, isConnecting: true }));
      
      const newSocket = io({
        path: '/api/socket',
        addTrailingSlash: false,
      });

      newSocket.on('connect', () => {
        // Clear any existing heartbeat interval
        if (window.__heartbeatInterval) {
          clearInterval(window.__heartbeatInterval);
        }
        // Start heartbeat
        window.__heartbeatInterval = setInterval(() => {
          newSocket.volatile.emit('ping', Date.now());
        }, 30000);

        setState(prev => ({
          ...prev,
          isConnecting: false,
          isConnected: true,
          error: null,
        }));
      });

      newSocket.on('reconnect', (attempt: number) => {
        setState(prev => ({
          ...prev,
          isConnecting: true,
          error: `Reconnecting (attempt ${attempt})`,
        }));
      });

      newSocket.on('pong', (latency: number) => {
        // Optionally handle latency updates
      });

      newSocket.on('message_history', (messages: Message[]) => {
        onReceiveMessage(prev => [
          ...prev,
          ...messages.map(message => ({
            ...message,
            timestamp: new Date(message.timestamp),
          })),
        ]);
      });

      newSocket.on('receive_message', (message: Message) => {
        onReceiveMessage(prev => [
          ...prev,
          { ...message, timestamp: new Date(message.timestamp) },
        ]);
      });

      newSocket.on('disconnect', () => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          error: 'Disconnected from chat server',
        }));
      });

      newSocket.on('error', (error: { message: string }) => {
        setState(prev => ({
          ...prev,
          error: error.message || 'An error occurred',
        }));
      });

      newSocket.on('message_ack', (receivedId: string) => {
        onReceiveMessage(prevMessages =>
          prevMessages.map(message =>
            message.id === receivedId ? { ...message, status: 'sent' } : message
          )
        );
      });

      newSocket.on('send_error', ({ tempId }: { tempId: string }) => {
        onReceiveMessage(prevMessages =>
          prevMessages.map(message =>
            message.id === tempId ? { ...message, status: 'error' } : message
          )
        );
      });

      setSocket(newSocket);
    }
  }, [socket, state.isConnecting, onReceiveMessage]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.off(); // Remove all event listeners
      socket.disconnect();
      setSocket(null);
      setState({
        isConnecting: false,
        isConnected: false,
        error: null,
      });
    }
  }, [socket]);

  const sendMessage = useCallback((content: string) => {
    if (socket && state.isConnected) {
      const tempId = Date.now().toString();
      onReceiveMessage(prev => [
        ...prev,
        {
          id: tempId,
          content,
          sender: 'currentUser',
          timestamp: new Date(),
          status: 'sending',
        },
      ]);
      socket.emit('send_message', { 
        content,
        tempId,
      });
    } else {
      setState(prev => ({
        ...prev,
        error: 'Cannot send message: not connected to chat server',
      }));
    }
  }, [socket, state.isConnected, onReceiveMessage]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
      if (window.__heartbeatInterval) {
        clearInterval(window.__heartbeatInterval);
      }
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    isConnecting: state.isConnecting,
    isConnected: state.isConnected,
    error: state.error,
  };
}
