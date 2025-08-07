# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/8593e9f7-5a52-4b08-96e3-6adf8120cde8

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/8593e9f7-5a52-4b08-96e3-6adf8120cde8) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/8593e9f7-5a52-4b08-96e3-6adf8120cde8) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Supabase-based Messages & Notifications System

### 1. Database Schema

#### Messages Table
- `id` (uuid, PK)
- `sender_id` (uuid, FK → auth.users)
- `receiver_id` (uuid, FK → auth.users)
- `content` (text)
- `created_at` (timestamp, default: now())
- `read` (boolean, default: false)

#### Notifications Table
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `title` (text)
- `message` (text)
- `type` (text)
- `read` (boolean, default: false)
- `link` (text, optional)
- `created_at` (timestamp, default: now())

### 2. RLS Policies
- Only sender/receiver can access their messages.
- Only the user can access their notifications.
- Anyone can insert notifications (for system or cross-user notifications).

### 3. Frontend Usage

#### Messages
- Use `useMessages(session, otherUserId)` to fetch, send, mark as read, and subscribe to real-time messages.

#### Notifications
- Use `useNotifications()` to fetch, mark as read, subscribe to real-time notifications, and create notifications.
- When creating a notification, the hook will also trigger a push notification via the Edge Function.

### 4. Push Notifications
- The Edge Function `send-push-notification.ts` sends FCM push notifications to the user's device(s) when a notification is created.
- FCM tokens are managed and stored in the `fcm_tokens` table.

### 5. Example Usage

#### Sending a Message
```ts
const { sendMessage } = useMessages(session, receiverId);
await sendMessage('Hello!');
```

#### Creating a Notification
```ts
const { createNotification } = useNotifications();
await createNotification({
  title: 'New Message',
  message: 'You have a new message!',
  type: 'message',
  link: '/messages',
});
```

#### Real-time Updates
- Both hooks automatically subscribe to real-time changes using Supabase Realtime.

### 6. Security
- All access is protected by RLS policies in Supabase.

### 7. Migration
- Run the provided SQL in your Supabase SQL editor to create tables and policies.
