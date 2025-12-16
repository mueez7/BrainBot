import { Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const SQL_SETUP = `-- Create chats table
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
CREATE INDEX idx_messages_created_at ON messages(created_at);`;

export function DatabaseSetup({ onRetry }: { onRetry: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SQL_SETUP);
    setCopied(true);
    toast.success('SQL commands copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const openSupabase = () => {
    window.open('https://supabase.com/dashboard/project/ikvpbjtpdhswfpngyluo/sql/new', '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#140a14] via-[#6a6381] to-[#160c16] p-4">
      <div className="backdrop-blur-[25px] backdrop-filter bg-gradient-to-r from-[rgba(56,55,73,0.56)] to-[rgba(19,15,25,0.56)] border border-white border-opacity-20 rounded-[20px] p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex gap-3 items-center justify-center mb-6">
          <div className="h-[20px] w-[20px]">
            <svg className="block size-full" fill="none" viewBox="0 0 29 29">
              <path
                d="M4.00067 24.0753C5.95329 20.6932 7.04805 18.7971 9.00067 15.415M9.00067 15.415C11.2337 10.9866 12.4258 8.47306 14.7186 4.07528C15.5007 2.57527 24.0007 24.0753 24.0007 24.0753C24.5007 25.0752 18.3271 16.805 15.5007 15.0753C12.3746 13.1621 9.00067 15.5752 9.00067 15.415Z"
                stroke="url(#paint0_linear_setup)"
                strokeLinecap="round"
                strokeWidth="8"
                strokeOpacity="0.79"
              />
              <defs>
                <linearGradient id="paint0_linear_setup" x1="14.015" y1="4.00028" x2="14.015" y2="24.1588" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="#845EBD" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="font-['FONTSPRING_DEMO_-_Integral_CF:Regular',sans-serif] text-white">Database Setup Required</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-[rgba(132,94,189,0.2)] border border-[#845EBD] rounded-lg p-4">
            <p className="text-white mb-2">⚠️ The database tables need to be set up first.</p>
            <p className="text-[rgba(255,255,255,0.8)]">Follow the steps below to complete the setup:</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-r from-[#A592C4] to-[#845EBD] text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 mt-1">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-2">Open Supabase SQL Editor</h3>
                <button
                  onClick={openSupabase}
                  className="flex items-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.2)] rounded-lg text-white transition-colors"
                >
                  <ExternalLink className="size-4" />
                  Open SQL Editor
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-r from-[#A592C4] to-[#845EBD] text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 mt-1">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-2">Copy the SQL commands</h3>
                <div className="relative">
                  <pre className="bg-[rgba(0,0,0,0.3)] text-[rgba(255,255,255,0.9)] p-4 rounded-lg overflow-x-auto max-h-60 text-sm font-mono">
{SQL_SETUP}
                  </pre>
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#A592C4] to-[#845EBD] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="size-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" />
                        Copy SQL
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-r from-[#A592C4] to-[#845EBD] text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 mt-1">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-2">Paste and Run</h3>
                <p className="text-[rgba(255,255,255,0.8)]">
                  Paste the SQL commands in the SQL Editor and click "Run" or press Ctrl+Enter
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-r from-[#A592C4] to-[#845EBD] text-white rounded-full size-8 flex items-center justify-center flex-shrink-0 mt-1">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-2">Retry Connection</h3>
                <button
                  onClick={onRetry}
                  className="px-6 py-3 bg-gradient-to-r from-[#A592C4] to-[#845EBD] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  I've Set Up the Database - Retry
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4">
            <h4 className="text-white mb-2">💡 What these tables do:</h4>
            <ul className="text-[rgba(255,255,255,0.8)] space-y-1 list-disc list-inside">
              <li><strong>chats</strong> - Stores your chat sessions</li>
              <li><strong>messages</strong> - Stores all messages (yours and AI responses)</li>
              <li>Row Level Security ensures your data is private</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
