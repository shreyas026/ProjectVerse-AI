import { useState, useRef, useEffect } from 'react';
import { aiApi } from '../../api/client';
import { Bot, Send, Brain, GraduationCap, Code2, Briefcase } from 'lucide-react';
import type { ChatMessage } from '../../types';

export default function EduAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm Edu AI, your academic mentor. How can I help you today? You can ask me about project ideas, career guidance, placement prep, coding challenges, or research roadmaps." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    if (!textToSend) setInput('');
    const newMsg: ChatMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, newMsg]);
    setLoading(true);

    try {
      const chatHistory = [...messages, newMsg];
      const res = await aiApi.chat({ messages: chatHistory });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to the backend. Please check if the server is running." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { label: 'Suggest Project Ideas', icon: Brain, prompt: 'Suggest 3 unique project ideas combining AI and Healthcare with Python.' },
    { label: 'Career Roadmap', icon: Briefcase, prompt: 'Provide a roadmap to become a Cloud DevOps Engineer in 2026.' },
    { label: 'Mock Interview Prep', icon: GraduationCap, prompt: 'Ask me 3 technical questions for a Backend developer role.' },
    { label: 'Code Review Help', icon: Code2, prompt: 'How do I optimize a recursive function to avoid stack overflow?' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-5xl mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
          <Bot size={22} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">Edu AI Mentor</h1>
          <p className="text-xs text-slate-400">RAG-powered conversational assistant with full access to project database</p>
        </div>
      </div>

      <div className="flex-1 grid md:grid-cols-4 gap-4 overflow-hidden min-h-0">
        {/* Sidebar suggestions */}
        <div className="hidden md:flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Suggested Prompts</h3>
          {suggestions.map(s => (
            <button key={s.label} onClick={() => handleSend(s.prompt)} disabled={loading}
              className="flex items-start gap-2.5 p-3 rounded-xl glass-card text-left text-xs transition-all hover:bg-white/5 disabled:opacity-50">
              <s.icon size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
              <span className="text-slate-300 font-medium leading-relaxed">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="md:col-span-3 glass-card flex flex-col h-full overflow-hidden p-4">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role !== 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-primary-400" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-primary-400" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 rounded-tl-none">
                  <div className="flex items-center gap-1.5 h-5">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Form */}
          <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} disabled={loading}
              className="input-field py-2.5 text-sm" placeholder="Ask anything about coding, roadmap, or project suggestions..." />
            <button type="submit" disabled={loading || !input.trim()}
              className="btn-primary p-3 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-50">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
