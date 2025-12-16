import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthForm } from './components/AuthForm';
import { ChatInterface } from './components/ChatInterface';
import { Toaster } from 'sonner';
import type { User } from '@supabase/supabase-js';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#140a14] via-[#6a6381] to-[#160c16]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      {user ? <ChatInterface /> : <AuthForm />}
    </>
  );
}
