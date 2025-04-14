'use client';

import * as React from "react";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChatMessage } from './ChatMessage';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
}

interface ChatWindowProps {
  messages?: Message[];
  currentUser: string;
  onSendMessage?: (content: string) => void;
  isConnecting?: boolean;
  isConnected?: boolean;
  error?: string | null;
  typingUsers?: string[];
}

export function ChatWindow({
  messages = [],
  currentUser,
  onSendMessage,
  isConnecting = false,
  isConnected = true,
  error = null,
  typingUsers = [],
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = React.useState("");
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chat with Partner</h2>
        <div className="flex items-center gap-2">
          {isConnecting && (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Connecting...</span>
            </div>
          )}
          {!isConnecting && !isConnected && (
            <div className="flex items-center text-destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">Disconnected</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-sm text-muted-foreground">
          {typingUsers.filter(user => user !== currentUser).join(', ')}
          {typingUsers.length === 1 ? ' is' : ' are'} typing...
        </div>
      )}

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={!isConnected}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!isConnected || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}