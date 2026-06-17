import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockAIConversations } from '@/services/mockData';
import { Send, Bot, User, Rocket, Database, Code2, Calendar, FileText, Sparkles, Layout, Shield, ChevronRight } from 'lucide-react';
import { aiService } from '@/services/ai.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  artifacts?: { type: string; data: unknown }[];
}

const tools = [
  { icon: Layout, label: 'System Architecture', prompt: 'Design the system architecture for [your idea]' },
  { icon: Database, label: 'Database Schema', prompt: 'Design the database schema for [your project]' },
  { icon: Code2, label: 'API Design', prompt: 'Design REST APIs for [your application]' },
  { icon: Calendar, label: 'Sprint Planning', prompt: 'Create a sprint plan for [your project]' },
  { icon: FileText, label: 'Documentation', prompt: 'Generate project documentation for [your idea]' },
  { icon: Shield, label: 'Risk Analysis', prompt: 'Analyze risks for building [your project]' },
];

export function AICoFounderPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const getConversationId = async () => {
    if (conversationId) return conversationId;
    const conversation = await aiService.createCofounderConversation();
    setConversationId(conversation._id);
    return conversation._id;
  };

  const handleSend = async () => {
    const prompt = input.trim();
    if (!prompt) return;
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
    setInput('');
    setIsLoading(true);

    try {
      const activeConversationId = await getConversationId();
      const data = await aiService.sendCofounderMessage(activeConversationId, prompt);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message || 'Failed to send message.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] -mx-4 lg:-mx-8 -mt-4">
      <div className="h-full flex flex-col lg:flex-row">
        <Card className="lg:w-72 rounded-none lg:rounded-r-xl border-0 lg:border-l-0 lg:border-y-0 shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">AI Co-Founder</CardTitle>
                <p className="text-xs text-muted-foreground">Technical Architect</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Tools</p>
              <div className="space-y-1.5">
                {tools.map((t) => (
                  <Button key={t.label} variant="ghost" className="w-full justify-start gap-2 text-sm h-9" onClick={() => setInput(t.prompt)}>
                    <t.icon className="w-4 h-4 text-primary" /> {t.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 flex flex-col">
          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center mb-4">
                  <Rocket className="w-10 h-10 text-rose-500" />
                </div>
                <h2 className="text-xl font-bold">Your AI Co-Founder</h2>
                <p className="text-muted-foreground mt-2 max-w-md">I help with system architecture, database design, API specs, sprint planning, and risk analysis. What's your project idea?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 max-w-lg w-full">
                  {tools.map((t) => (
                    <button key={t.label} onClick={() => setInput(t.prompt)} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-accent transition-colors text-left">
                      <t.icon className="w-5 h-5 text-primary shrink-0" />
                      <div><p className="text-sm font-medium">{t.label}</p></div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shrink-0 mt-1">
                        <Rocket className="w-4 h-4 text-white" />
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
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shrink-0">
                      <Rocket className="w-4 h-4 text-white" />
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
          <div className="p-4 border-t">
            <div className="flex gap-2 max-w-3xl mx-auto">
              <Input placeholder="Describe your project idea..." className="flex-1" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="gap-2"><Sparkles className="w-4 h-4" /> Analyze</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
