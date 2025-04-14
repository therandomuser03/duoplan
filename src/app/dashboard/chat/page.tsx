'use client';

import * as React from "react";
import { useSession } from "next-auth/react";
import { ChatWindow } from "@/components/chat/chat-window";
import { useChat, Message } from "@/hooks/use-chat";

// Define a type that allows either a direct Message or a functional update.
type MessageUpdater = Message | ((prev: Message[]) => Message[]);

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = React.useState<Message[]>([]);

  const handleReceiveMessage = React.useCallback(
    (update: React.SetStateAction<Message[]>) => {
      setMessages(update);
    },
    []
  );

  const { sendMessage, isConnecting, isConnected, error } = useChat({
    onReceiveMessage: handleReceiveMessage,
  });

  const handleSendMessage = (content: string) => {
    if (session?.user?.email) {
      sendMessage(content);
    }
  };

  if (!session?.user?.email) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Chat Unavailable</h1>
          <p className="text-muted-foreground">
            Please sign in to access the chat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Chat with Partner</h1>
        <ChatWindow
          messages={messages}
          currentUser={session.user.email}
          onSendMessage={handleSendMessage}
          isConnecting={isConnecting}
          isConnected={isConnected}
          error={error}
        />
      </div>
    </div>
  );
}
