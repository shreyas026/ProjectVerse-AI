import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Sparkles, HelpCircle, Code2, BookOpen, Zap } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestions = [
  { icon: Code2, label: 'Code Help', text: 'How do I implement JWT authentication in Node.js?' },
  { icon: BookOpen, label: 'Explain', text: 'Explain React hooks in simple terms' },
  { icon: Zap, label: 'Debug', text: 'Help me debug this error: Cannot read property of undefined' },
  { icon: HelpCircle, label: 'General', text: 'What are the best practices for REST API design?' },
];

export function AIChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
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
        jwt: `Here's how to implement JWT authentication in Node.js:\n\n**1. Install dependencies**\n\`npm install jsonwebtoken bcryptjs express\`\n\n**2. Create auth middleware**\n\`\`\`javascript\nconst jwt = require('jsonwebtoken');\n\nconst authMiddleware = (req, res, next) => {\n  const token = req.header('Authorization')?.replace('Bearer ', '');\n  if (!token) return res.status(401).json({ error: 'Access denied' });\n  \n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.userId = decoded.userId;\n    next();\n  } catch (err) {\n    res.status(400).json({ error: 'Invalid token' });\n  }\n};\n\`\`\`\n\n**3. Login route**\n\`\`\`javascript\napp.post('/login', async (req, res) => {\n  const user = await User.findOne({ email: req.body.email });\n  if (!user || !await bcrypt.compare(req.body.password, user.password)) {\n    return res.status(400).json({ error: 'Invalid credentials' });\n  }\n  \n  const token = jwt.sign(\n    { userId: user._id }, \n    process.env.JWT_SECRET, \n    { expiresIn: '24h' }\n  );\n  \n  res.json({ token, user });\n});\n\`\`\`\n\n**Best practices:**\n• Store JWT_SECRET in environment variables\n• Use short expiry (15-60 min) with refresh tokens\n• Always use HTTPS in production\n• Store tokens in httpOnly cookies`,
        react: `React Hooks are functions that let you use state and lifecycle features in functional components.\n\n**useState** - Manage component state:\n\`\`\`jsx\nconst [count, setCount] = useState(0);\n// count = current value, setCount = updater function\n\`\`\`\n\n**useEffect** - Handle side effects:\n\`\`\`jsx\nuseEffect(() => {\n  // Runs after render\n  fetchData();\n  \n  return () => {\n    // Cleanup function\n    cleanup();\n  };\n}, [dependency]); // Only re-run when dependency changes\n\`\`\`\n\n**useContext** - Access React context:\n\`\`\`jsx\nconst value = useContext(MyContext);\n\`\`\`\n\n**Custom Hooks** - Reuse stateful logic:\n\`\`\`jsx\nfunction useLocalStorage(key, initial) {\n  const [value, setValue] = useState(\n    () => JSON.parse(localStorage.getItem(key)) || initial\n  );\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n  return [value, setValue];\n}\n\`\`\`\n\n**Rules of Hooks:**\n1. Only call hooks at the top level\n2. Only call hooks from React functions\n3. Hooks must start with "use"`,
      };
      const lower = input.toLowerCase();
      let responseText = responses.react;
      if (lower.includes('jwt') || lower.includes('auth')) responseText = responses.jwt;
      else if (lower.includes('react') || lower.includes('hook')) responseText = responses.react;
      else responseText = `Great question! Let me help you with that.\n\nBased on your query about "${input.slice(0, 50)}...", here's what I can tell you:\n\n**Key Points:**\n1. This is an important topic in modern software development\n2. There are several approaches depending on your specific use case\n3. Best practices have evolved significantly in recent years\n\n**Quick Answer:**\nThe most common and recommended approach would be to research thoroughly, start with a minimal viable implementation, and iterate based on your specific requirements.\n\nWould you like me to provide more specific details about any particular aspect?`;

      setMessages((prev) => [...prev, { role: 'assistant', content: responseText }]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="h-[calc(100vh-8rem)] -mx-4 lg:-mx-8 -mt-4 flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                <Bot className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold">AI Assistant</h2>
              <p className="text-muted-foreground mt-2 max-w-md">Your general-purpose AI helper. Ask me anything about coding, concepts, projects, or college life!</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 max-w-lg w-full">
                {suggestions.map((s) => (
                  <button key={s.label} onClick={() => setInput(s.text)} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-accent transition-colors text-left">
                    <s.icon className="w-5 h-5 text-primary shrink-0" />
                    <div><p className="text-sm font-medium">{s.label}</p></div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 mt-1">
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
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
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
        <div className="p-4 border-t">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <Input placeholder="Ask anything..." className="flex-1" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon"><Send className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
