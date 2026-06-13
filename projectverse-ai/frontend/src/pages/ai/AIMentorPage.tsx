import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockAIConversations, mockUser } from '@/services/mockData';
import { Send, Bot, User, BookOpen, Briefcase, Target, Award, Lightbulb, Sparkles, Compass, ChevronRight, GraduationCap } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachments?: { type: string; data: unknown }[];
}

const quickActions = [
  { icon: Compass, label: 'Career Roadmap', prompt: 'I want to become a [role]. Create a learning roadmap for me.' },
  { icon: BookOpen, label: 'Interview Prep', prompt: 'Help me prepare for a [company] interview for [role].' },
  { icon: Award, label: 'Certifications', prompt: 'What certifications should I get for [career path]?' },
  { icon: Target, label: 'Skill Analysis', prompt: 'Analyze my skills and suggest what I should learn next.' },
];

export function AIMentorPage() {
  const [messages, setMessages] = useState<Message[]>(mockAIConversations[0]?.messages || []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const responses: Record<string, string> = {
        'ai engineer': `Great choice! Here's your personalized roadmap to become an AI Engineer:\n\n**Phase 1: Foundations (3 months)**\n• Master Python, NumPy, Pandas\n• Linear Algebra, Calculus, Probability\n• Git, Jupyter, VS Code\n\n**Phase 2: Machine Learning (4 months)**\n• Supervised & Unsupervised Learning\n• Scikit-learn, Feature Engineering\n• Projects: House Price Prediction, Sentiment Analysis\n\n**Phase 3: Deep Learning (4 months)**\n• Neural Networks, CNNs, RNNs, Transformers\n• PyTorch or TensorFlow\n• Projects: Image Classifier, Chatbot\n\n**Phase 4: MLOps (3 months)**\n• Docker, Kubernetes, CI/CD\n• MLflow, Model Deployment\n• Cloud: AWS SageMaker or GCP Vertex AI\n\n**Top Certifications:**\n1. Deep Learning Specialization (Coursera)\n2. TensorFlow Developer Certificate\n3. AWS Machine Learning Specialty`,
      };
      const lower = input.toLowerCase();
      const responseText = Object.entries(responses).find(([k]) => lower.includes(k))?.[1] ||
        `That's a great question! As your AI Mentor, I'm here to help you navigate your tech career.\n\nBased on your profile (CSE student with React, Node.js, and Python skills), here's what I recommend:\n\n1. **Continue strengthening your full-stack skills** - You're already good with React and Node.js\n2. **Add AI/ML to your toolkit** - Your Python knowledge is a great foundation\n3. **Build projects that combine both** - Full-stack AI applications are in high demand\n\nWould you like me to create a detailed learning plan or help you with something specific?`;

      setMessages((prev) => [...prev, { role: 'assistant', content: responseText }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] -mx-4 lg:-mx-8 -mt-4">
      <div className="h-full flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Card className="lg:w-72 rounded-none lg:rounded-r-xl border-0 lg:border-l-0 lg:border-y-0 shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">AI Mentor</CardTitle>
                <p className="text-xs text-muted-foreground">Personal Learning Guide</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Quick Actions</p>
              <div className="space-y-1.5">
                {quickActions.map((a) => (
                  <Button key={a.label} variant="ghost" className="w-full justify-start gap-2 text-sm h-9" onClick={() => { setInput(a.prompt); }}>
                    <a.icon className="w-4 h-4 text-primary" /> {a.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Your Stats</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Coding Rating</span><span className="font-medium">{mockUser.scores?.codingRating}</span></div>
                <div className="flex justify-between text-sm"><span>Projects</span><span className="font-medium">12</span></div>
                <div className="flex justify-between text-sm"><span>Placement Ready</span><span className="font-medium">{mockUser.scores?.placementReadiness}%</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                  <Bot className="w-10 h-10 text-violet-500" />
                </div>
                <h2 className="text-xl font-bold">Your Personal AI Mentor</h2>
                <p className="text-muted-foreground mt-2 max-w-md">I can help with career guidance, learning roadmaps, interview prep, and skill recommendations. What would you like to explore?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 max-w-lg w-full">
                  {quickActions.map((a) => (
                    <button key={a.label} onClick={() => setInput(a.prompt)} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-accent transition-colors text-left">
                      <a.icon className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{a.label}</p>
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-2xl px-4 py-3`}>
                      <div className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</div>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2 max-w-3xl mx-auto">
              <Input
                placeholder="Ask your AI Mentor anything..."
                className="flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="gap-2">
                <Sparkles className="w-4 h-4" /> Ask
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
