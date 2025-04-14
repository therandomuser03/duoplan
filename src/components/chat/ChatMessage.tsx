import { Progress } from '@/components/ui/progress'
import { Message } from '@/hooks/use-chat'
import { AlertCircle } from 'lucide-react'

export function ChatMessage({ message }: { message: Message }) {
  return (
    <div className={`flex ${message.sender === 'currentUser' ? 'justify-end' : 'justify-start'} gap-2`}>
      <div className={`max-w-[85%] space-y-1 rounded-xl p-3 ${
        message.sender === 'currentUser' 
          ? 'bg-primary text-primary-foreground ml-8'
          : 'bg-muted mr-8'
      }`}>
        <p className="text-sm">{message.content}</p>
        {message.status === 'error' && (
          <div className="text-destructive text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Failed to send
          </div>
        )}
        <div className="flex items-center justify-end gap-1.5">
          <span className="text-xs opacity-80">
            {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </span>
          {message.sender === 'currentUser' && (
            <span className={`text-[0.7rem] ${message.status === 'read' ? 'text-primary' : 'opacity-70'}`}>
              {message.status === 'sending' && (
                <Progress value={30} className="h-1 w-4" />
              )}
              {message.status === 'sent' && (
                <svg width="12" height="12" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
              {message.status === 'delivered' && (
                <svg width="12" height="12" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              )}
              {message.status === 'read' && (
                <svg width="12" height="12" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  <path fill="currentColor" d="M18 7l-1.41-1.41L9 12.17L6.41 9.59L5 11l5 5l8-8z" className="text-primary"/>
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}