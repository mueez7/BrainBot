# Supabase Database Setup

To make this chatbot application work, you need to create two tables in your Supabase database.

## Quick Setup Steps

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/ikvpbjtpdhswfpngyluo
2. Click on "SQL Editor" in the left sidebar
3. Click "New query" button
4. Copy and paste ALL the SQL commands below
5. Click "Run" or press Ctrl+Enter

## SQL Setup Commands

```sql
-- Create chats table
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  attachments JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for chats table
CREATE POLICY "Users can view their own chats"
  ON chats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chats"
  ON chats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chats"
  ON chats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chats"
  ON chats FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for messages table
CREATE POLICY "Users can view messages from their chats"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their chats"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_updated_at ON chats(updated_at DESC);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

## What These Tables Do

### `chats` table
- Stores individual chat sessions
- Each user can have multiple chats
- Tracks when the chat was created and last updated

### `messages` table
- Stores individual messages within each chat
- Each message has a role ('user' or 'assistant')
- Messages are linked to a specific chat

## Row Level Security (RLS)
The policies ensure that:
- Users can only see and manage their own chats
- Users can only see and create messages in their own chats
- All data is isolated per user for privacy

## Next Steps
After running these SQL commands, your application will be able to:
1. Create new chat sessions
2. Send messages to the AI
3. Store and retrieve chat history
4. Display recent chats in the sidebar