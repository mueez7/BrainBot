import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Brain } from 'lucide-react';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Logged in successfully!');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Account created! Please check your email to verify.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#140a14] via-[#6a6381] to-[#160c16] p-4">
      <div className="backdrop-blur-[25px] backdrop-filter bg-gradient-to-r from-[rgba(56,55,73,0.56)] to-[rgba(19,15,25,0.56)] border border-white border-opacity-20 rounded-[20px] p-8 w-full max-w-md">
        <div className="flex gap-3 items-center justify-center mb-8">
          <div className="relative size-[32px] rounded-full bg-gradient-to-br from-[#A592C4] to-[#845EBD] flex items-center justify-center">
            <Brain className="size-5 text-white" />
          </div>
          <h1 className="font-['FONTSPRING_DEMO_-_Integral_CF:Regular',sans-serif] text-white">BrainBot</h1>
        </div>

        <h2 className="text-center text-white mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg text-white placeholder-[rgba(255,255,255,0.6)] focus:outline-none focus:border-[#845EBD]"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg text-white placeholder-[rgba(255,255,255,0.6)] focus:outline-none focus:border-[#845EBD]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#A592C4] to-[#845EBD] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-[rgba(255,255,255,0.6)] mt-4">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#A592C4] hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
