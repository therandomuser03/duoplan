// src/app/api/webhook/clerk/route.js
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(request) {
  // Get the Clerk webhook signature from headers
  const svix_id = headers().get('svix-id');
  const svix_timestamp = headers().get('svix-timestamp');
  const svix_signature = headers().get('svix-signature');
  
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }
  
  // Get the webhook body
  const payload = await request.json();
  const body = JSON.stringify(payload);
  
  // Verify the webhook signature
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response('Missing webhook secret', { status: 500 });
  }
  
  const wh = new Webhook(webhookSecret);
  let evt;
  
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
  
  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
  
  console.log(`Processing ${eventType} event for user: ${id}`);
  
  // Initialize Supabase admin client
  const supabase = createAdminClient();
  
  // Process the different event types
  if (eventType === 'user.created' || eventType === 'user.updated') {
    // Extract user data from the webhook payload
    const { id, email_addresses, username, first_name, last_name, created_at, updated_at, image_url } = evt.data;
    
    // Find primary email
    const primaryEmail = email_addresses?.find(email => email.id === evt.data.primary_email_address_id);
    
    // Prepare user data for Supabase
    const userData = {
      id,
      email: primaryEmail?.email_address || null,
      username: username || null,
      first_name: first_name || null,
      last_name: last_name || null,
      created_at: created_at || new Date().toISOString(),
      updated_at: updated_at || new Date().toISOString(),
      avatar_url: image_url || null
    };
    
    try {
      // Insert or update user in Supabase
      const { error } = await supabase
        .from('users')
        .upsert(userData, {
          onConflict: 'id',
          returning: 'minimal'
        });
      
      if (error) {
        console.error('Error upserting user:', error);
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      console.log(`Successfully synced user ${id} to Supabase`);
      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else if (eventType === 'user.deleted') {
    // Handle user deletion
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting user:', error);
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      console.log(`Successfully deleted user ${id} from Supabase`);
      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error processing deletion webhook:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Return a 200 response for unhandled event types
  return new Response(JSON.stringify({ received: true }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}