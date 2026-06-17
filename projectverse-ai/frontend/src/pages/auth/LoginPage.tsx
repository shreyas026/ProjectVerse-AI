import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Rocket, Mail, Lock, Github, Chrome, Linkedin, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSocialLogin = async (provider: 'google' | 'github' | 'linkedin') => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (provider === 'google') {
        res = await authService.loginWithGoogle(
          'google-mock-id',
          'google.user@projectverse.ai',
          'Google',
          'User',
          'https://api.dicebear.com/7.x/avataaars/svg?seed=google'
        );
      } else if (provider === 'github') {
        res = await authService.loginWithGithub(
          'github-mock-id',
          'github.user@projectverse.ai',
          'Github',
          'User',
          'https://api.dicebear.com/7.x/avataaars/svg?seed=github'
        );
      } else {
        res = await authService.loginWithLinkedin(
          'linkedin-mock-id',
          'linkedin.user@projectverse.ai',
          'Linkedin',
          'User',
          'https://api.dicebear.com/7.x/avataaars/svg?seed=linkedin'
        );
      }

      if (res.success) {
        setUser(res.data.user as any);
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authService.login(email, password);
      if (res.success) {
        setUser(res.data.user as any);
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Rocket className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back to ProjectVerse</h1>
          <p className="text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            {/* Social Login */}
            <div className="grid grid-cols-3 gap-2">
              <Button type="button" variant="outline" className="gap-1 px-1 text-xs" onClick={() => handleSocialLogin('google')} disabled={loading}>
                <Chrome className="w-3.5 h-3.5" /> Google
              </Button>
              <Button type="button" variant="outline" className="gap-1 px-1 text-xs" onClick={() => handleSocialLogin('github')} disabled={loading}>
                <Github className="w-3.5 h-3.5" /> GitHub
              </Button>
              <Button type="button" variant="outline" className="gap-1 px-1 text-xs" onClick={() => handleSocialLogin('linkedin')} disabled={loading}>
                <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><Separator /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Email Login */}
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="student@college.edu" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm text-muted-foreground">Remember me</label>
                </div>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</> : 'Sign In'}
              </Button>
            </form>

            {/* Demo login hint */}
            <div className="bg-muted/50 rounded-lg px-3 py-2 text-xs text-muted-foreground text-center">
              Demo: <code className="text-primary">demo@projectverse.ai</code> / <code className="text-primary">Demo@12345</code>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
}
