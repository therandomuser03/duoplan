'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, UserPlus, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface UserPair {
  id: string;
  user1_id: string;
  user2_id: string;
  status: 'pending' | 'accepted';
  user1: User;
  user2: User;
  created_at: string;
}

interface Notification {
  id: string;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export function PairingManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [pairs, setPairs] = useState<UserPair[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .neq('id', user?.id);

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    setUsers(data || []);
  }, [user?.id]);

  const fetchPairs = useCallback(async () => {
    const { data, error } = await supabase
      .from('user_pairs')
      .select(`
        *,
        user1:users!user_pairs_user1_id_fkey(*),
        user2:users!user_pairs_user2_id_fkey(*)
      `)
      .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`);

    if (error) {
      console.error('Error fetching pairs:', error);
      return;
    }

    setPairs(data || []);
  }, [user?.id]);

  const fetchNotifications = useCallback(async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    setNotifications(data || []);
  }, [user?.id]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(userData);
      }
    };

    getUser();
    fetchUsers();
    fetchPairs();
    fetchNotifications();

    const subscription = supabase
      .channel('pairing_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_pairs',
        },
        () => {
          fetchPairs();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUsers, fetchPairs, fetchNotifications]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', `%${searchEmail}%`)
      .neq('id', user?.id);

    if (error) {
      console.error('Error searching users:', error);
      return;
    }

    setUsers(data || []);
  };

  const handlePairRequest = async (targetUserId: string) => {
    if (!user) return;

    const { error } = await supabase.from('user_pairs').insert([
      {
        user1_id: user.id,
        user2_id: targetUserId,
        status: 'pending',
      },
    ]);

    if (error) {
      console.error('Error sending pair request:', error);
      toast.error('Failed to send pair request');
      return;
    }

    // Create notification for the target user
    await supabase.from('notifications').insert([
      {
        user_id: targetUserId,
        type: 'pair_request',
        content: `${user.first_name} ${user.last_name} sent you a pair request`,
      },
    ]);

    toast.success('Pair request sent successfully');
  };

  const handleAcceptPair = async (pairId: string) => {
    const { error } = await supabase
      .from('user_pairs')
      .update({ status: 'accepted' })
      .eq('id', pairId);

    if (error) {
      console.error('Error accepting pair:', error);
      toast.error('Failed to accept pair request');
      return;
    }

    const pair = pairs.find((p) => p.id === pairId);
    if (pair) {
      // Create notification for the other user
      await supabase.from('notifications').insert([
        {
          user_id: pair.user1_id,
          type: 'pair_accepted',
          content: `${pair.user2.first_name} ${pair.user2.last_name} accepted your pair request`,
        },
      ]);
    }

    toast.success('Pair request accepted successfully');
  };

  const handleRejectPair = async (pairId: string) => {
    const { error } = await supabase
      .from('user_pairs')
      .delete()
      .eq('id', pairId);

    if (error) {
      console.error('Error rejecting pair:', error);
      toast.error('Failed to reject pair request');
      return;
    }

    toast.success('Pair request rejected successfully');
  };

  const markNotificationAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
      return;
    }

    fetchNotifications();
    toast.success('Notification marked as read');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Pairing</h2>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-gray-600 hover:text-gray-900"
        >
          <Bell className="w-6 h-6" />
          {notifications.some((n) => !n.is_read) && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>

      {showNotifications && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-2">Notifications</h3>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-2 rounded ${
                  notification.is_read ? 'bg-gray-50' : 'bg-indigo-50'
                }`}
              >
                <p className="text-sm">{notification.content}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                  {!notification.is_read && (
                    <button
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-sm text-gray-500">No notifications</p>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Search by email"
              className="flex-1 p-2 rounded border"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
            >
              Search
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <h3 className="font-semibold">Available Users</h3>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div>
                <p className="font-medium">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => handlePairRequest(user.id)}
                className="p-2 text-indigo-600 hover:text-indigo-800"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold mb-4">Pair Requests</h3>
        <div className="space-y-4">
          {pairs
            .filter((pair) => pair.status === 'pending')
            .map((pair) => (
              <div
                key={pair.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <p className="font-medium">
                    {pair.user1_id === user?.id
                      ? `${pair.user2.first_name} ${pair.user2.last_name}`
                      : `${pair.user1.first_name} ${pair.user1.last_name}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {pair.user1_id === user?.id ? 'Sent' : 'Received'}
                  </p>
                </div>
                {pair.user2_id === user?.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptPair(pair.id)}
                      className="p-2 text-green-600 hover:text-green-800"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRejectPair(pair.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          {pairs.filter((pair) => pair.status === 'pending').length === 0 && (
            <p className="text-sm text-gray-500">No pending pair requests</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold mb-4">Current Pairs</h3>
        <div className="space-y-4">
          {pairs
            .filter((pair) => pair.status === 'accepted')
            .map((pair) => (
              <div
                key={pair.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <p className="font-medium">
                    {pair.user1_id === user?.id
                      ? `${pair.user2.first_name} ${pair.user2.last_name}`
                      : `${pair.user1.first_name} ${pair.user1.last_name}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Paired since{' '}
                    {new Date(pair.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          {pairs.filter((pair) => pair.status === 'accepted').length === 0 && (
            <p className="text-sm text-gray-500">No active pairs</p>
          )}
        </div>
      </div>
    </div>
  );
} 