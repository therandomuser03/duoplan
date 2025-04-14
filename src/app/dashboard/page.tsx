import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PlannerBoard } from '@/components/planner/PlannerBoard';
import { Calendar } from '@/components/calendar/Calendar';
import { Chat } from '@/components/chat/Chat';

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Planner Section */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <PlannerBoard />
            </div>
          </div>

          {/* Calendar and Chat Section */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="rounded-lg bg-white p-6 shadow">
              <Calendar />
            </div>

            {/* Chat */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat</h2>
              <Chat />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 