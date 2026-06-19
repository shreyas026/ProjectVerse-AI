import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { Zap, Mail, Lock, User, Eye, EyeOff, GraduationCap, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  role: z.enum(['student', 'faculty']),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'student' },
  });

  const role = watch('role');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.register(data);
      const { user, access_token, refresh_token } = res.data;
      setAuth(user, access_token, refresh_token);
      toast.success(`Welcome to ProjectVerse AI, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'faculty' ? '/faculty/dashboard' : '/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl">
              <span className="text-gradient">ProjectVerse</span><span className="text-white"> AI</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-slate-400">Join the academic innovation ecosystem</p>
        </div>

        <div className="glass-card">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button type="button" id="role-student"
              onClick={() => setValue('role', 'student')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${role === 'student' ? 'border-primary-500 bg-primary-600/20 text-primary-300' : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'}`}>
              <GraduationCap size={24} />
              <span className="text-sm font-medium">Student</span>
            </button>
            <button type="button" id="role-faculty"
              onClick={() => setValue('role', 'faculty')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${role === 'faculty' ? 'border-primary-500 bg-primary-600/20 text-primary-300' : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'}`}>
              <BookOpen size={24} />
              <span className="text-sm font-medium">Faculty</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input {...register('name')} placeholder="Shreyas Kumar"
                  className="input-field pl-10" id="register-name" />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input {...register('email')} type="email" placeholder="you@college.edu"
                  className="input-field pl-10" id="register-email" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters"
                  className="input-field pl-10 pr-10" id="register-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" id="register-submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
