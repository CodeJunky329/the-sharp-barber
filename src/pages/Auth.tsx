import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scissors, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isForgotPassword) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent!');
        setIsForgotPassword(false);
      }
      return;
    }

    if (isSignUp) {
      if (!fullName.trim() || !phone.trim()) {
        toast.error('Please fill in all fields');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName.trim(), phone.trim());
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created! Check your email to verify.');
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(42_78%_52%/0.04)_0%,transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-2xl p-8 sm:p-10 w-full max-w-md relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="text-xl font-serif font-bold text-gradient-gold">LUXE</span>
        </div>

        <h1 className="text-2xl font-serif font-bold mb-1">
          {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {isForgotPassword
            ? 'Enter your email to receive a reset link.'
            : isSignUp
            ? 'Join LUXE and start booking your sessions.'
            : 'Sign in to manage your bookings.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && !isForgotPassword && (
            <>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" maxLength={100} required className="bg-secondary/50 border-border/50 focus:border-primary" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" maxLength={20} required className="bg-secondary/50 border-border/50 focus:border-primary" />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="bg-secondary/50 border-border/50 focus:border-primary" />
          </div>

          {!isForgotPassword && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required className="bg-secondary/50 border-border/50 focus:border-primary" />
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm uppercase tracking-wider py-5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        {!isForgotPassword && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        )}

        {!isSignUp && !isForgotPassword && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            <button onClick={() => setIsForgotPassword(true)} className="text-primary/70 hover:text-primary hover:underline">
              Forgot password?
            </button>
          </p>
        )}

        {isForgotPassword && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            <button onClick={() => setIsForgotPassword(false)} className="text-primary hover:underline">
              Back to sign in
            </button>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
