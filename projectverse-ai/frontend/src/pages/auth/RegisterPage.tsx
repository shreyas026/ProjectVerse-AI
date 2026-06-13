import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Rocket, User, Mail, Lock, Chrome, Github, Eye, EyeOff, GraduationCap, Building2, Briefcase, UserCircle } from 'lucide-react';

const ROLES = [
  { value: 'student', label: 'Student', icon: GraduationCap },
  { value: 'faculty', label: 'Faculty', icon: Building2 },
  { value: 'alumni', label: 'Alumni', icon: Briefcase },
  { value: 'company', label: 'Company', icon: UserCircle },
];

const DEPARTMENTS = ['CSE', 'ECE', 'Mechanical', 'Civil', 'Biotechnology', 'MBA', 'Other'];

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Rocket className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground mt-1">Join the ProjectVerse community</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            {/* Step indicator */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <p className="font-medium text-center">What brings you to ProjectVerse?</p>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === r.value ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'}`}
                    >
                      <r.icon className={`w-6 h-6 ${role === r.value ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-medium">{r.label}</span>
                    </button>
                  ))}
                </div>
                <Button className="w-full" disabled={!role} onClick={() => setStep(2)}>Continue</Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="John" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="student@college.edu" className="pl-10" />
                  </div>
                </div>
                {role === 'student' && (
                  <>
                    <div className="space-y-2">
                      <Label>College Name</Label>
                      <Input placeholder="Stanford University" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Year of Study</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4].map((y) => <SelectItem key={y} value={y.toString()}>Year {y}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-1" onClick={() => setStep(3)}>Continue</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" className="pl-10 pr-10" />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="Repeat password" />
                </div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><Separator /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="gap-2"><Chrome className="w-4 h-4" /> Google</Button>
                  <Button variant="outline" className="gap-2"><Github className="w-4 h-4" /> GitHub</Button>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                  <Button className="flex-1" size="lg">Create Account</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
