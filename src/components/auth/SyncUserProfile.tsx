'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SyncUserProfile() {
  const { user, isSignedIn } = useUser();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!isSignedIn || !user) {
      console.warn('⚠️ User not signed in or user object missing');
      return;
    }

    const syncUser = async () => {
      console.log('🟢 Clerk user:', user); // 🧩 Add this
      const payload = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? '',
        username: user.username || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'anonymous',
        first_name: user.firstName,
        last_name: user.lastName,
        avatar_url: user.imageUrl,
      };

      console.log('📦 Payload being sent to Supabase:', payload); // 🧩 Add this

      const { data, error } = await supabase
        .from('users')
        .upsert(payload, { onConflict: 'id' })
        .select();

      if (error) {
        console.error(
          '❌ Error syncing user to Supabase:',
          JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
        );
      } else {
        console.log('✅ Supabase insert success. Returned:', data); // 🧩 Add this
      }
    };

    syncUser();
  }, [isSignedIn, user, supabase]);

  return null;
}
