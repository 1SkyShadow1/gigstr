// supabase/functions/send-push-notification.ts
import { serve } from 'std/server';

// You need to add your Firebase Admin SDK credentials as environment variables
const admin = await import('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: Deno.env.get('FIREBASE_PROJECT_ID'),
      clientEmail: Deno.env.get('FIREBASE_CLIENT_EMAIL'),
      privateKey: Deno.env.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
    }),
  });
}

serve(async (req) => {
  try {
    const { user_id, notification } = await req.json();
    if (!user_id || !notification) {
      return new Response('Missing user_id or notification', { status: 400 });
    }
    // Fetch FCM tokens from Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const tokensRes = await fetch(`${supabaseUrl}/rest/v1/fcm_tokens?user_id=eq.${user_id}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    const tokens = await tokensRes.json();
    if (!tokens.length) {
      return new Response('No FCM tokens found for user', { status: 404 });
    }
    const fcmTokens = tokens.map((t: any) => t.token);
    // Send notification
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      tokens: fcmTokens,
      data: notification.data || {},
    };
    const response = await admin.messaging().sendMulticast(message);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
}); 