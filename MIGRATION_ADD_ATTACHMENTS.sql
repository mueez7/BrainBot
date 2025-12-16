-- Migration to add attachments column to messages table
-- Run this in your Supabase SQL editor if you have an existing database

-- Add the attachments column if it doesn't exist
ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachments JSONB;

-- Verify the column was added (optional - for debugging)
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'messages' AND column_name = 'attachments';

-- If you want to clear existing messages to test with new attachments, uncomment below:
-- DELETE FROM messages WHERE attachments IS NULL;