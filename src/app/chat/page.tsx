'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';
import Loading from '@/components/loading';
import Toast from '@/components/toast';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  sender: {
    full_name: string;
  };
}

interface User {
  id: string;
  full_name: string;
  email: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [partner, setPartner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!partner) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users(full_name)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partner.id}),and(sender_id.eq.${partner.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [partner, supabase]);

  const fetchPartner = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: pair, error: pairError } = await supabase
        .from('pairs')
        .select('user1_id, user2_id')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .single();

      if (pairError && pairError.code !== 'PGRST116') {
        throw new Error('Error fetching partner');
      }

      if (!pair) {
        setError('You need to connect with a partner first');
        return;
      }

      const partnerId = pair.user1_id === user.id ? pair.user2_id : pair.user1_id;
      const { data: partnerData, error: partnerError } = await supabase
        .from('users')
        .select('*')
        .eq('id', partnerId)
        .single();

      if (partnerError) throw partnerError;
      setPartner(partnerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const setupRealtimeSubscription = useCallback(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    fetchMessages();
    fetchPartner();
    setupRealtimeSubscription();
  }, [fetchMessages, fetchPartner, setupRealtimeSubscription]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !partner) return;

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('messages').insert([
        {
          content: newMessage,
          sender_id: user.id,
          receiver_id: partner.id,
        },
      ]);

      if (error) throw error;
      setNewMessage('');
      setToast({ message: 'Message sent successfully', type: 'success' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setToast({ message: 'Failed to send message', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          {error === 'You need to connect with a partner first' && (
            <a
              href="/connect"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
            >
              Connect with a partner
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="border-b p-4">
        <h1 className="text-xl font-semibold">
          Chat with {partner?.full_name || 'Loading...'}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === partner?.id ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-xs rounded-lg p-3 ${
                message.sender_id === partner?.id
                  ? 'bg-gray-100'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {message.sender.full_name}
              </p>
              <p>{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender_id === partner?.id
                    ? 'text-gray-500'
                    : 'text-indigo-100'
                }`}
              >
                {format(new Date(message.created_at), 'h:mm a')}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
} 