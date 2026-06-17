import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIMessageContent } from '@/components/ai/AIMessageContent';
import { Bot, User, Send, HelpCircle, Code2, BookOpen, Zap, Paperclip, X } from 'lucide-react';
import { aiService, type ChatbotAttachment } from '@/services/ai.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachments?: ChatbotAttachment[];
}

const suggestions = [
  { icon: Code2, label: 'Code Help', text: 'How do I implement JWT authentication in Node.js?' },
  { icon: BookOpen, label: 'Explain', text: 'Explain React hooks in simple terms' },
  { icon: Zap, label: 'Debug', text: 'Help me debug this error: Cannot read property of undefined' },
  { icon: HelpCircle, label: 'General', text: 'What are the best practices for REST API design?' },
];

const attachmentType = (file: File): ChatbotAttachment['type'] => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  return 'file';
};

const formatSize = (size: number) => {
  if (size < 1024 * 1024) return Math.ceil(size / 1024) + ' KB';
  return (size / (1024 * 1024)).toFixed(1) + ' MB';
};

export function AIChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<ChatbotAttachment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const getConversationId = async () => {
    if (conversationId) return conversationId;
    const conversation = await aiService.createChatbotConversation();
    setConversationId(conversation._id);
    return conversation._id;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const next = Array.from(files).map((file) => ({
      type: attachmentType(file),
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
    }));
    setAttachments((prev) => [...prev, ...next]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    const prompt = input.trim();
    if ((!prompt && attachments.length === 0) || isLoading) return;

    const outgoingAttachments = attachments;
    const userContent = prompt || 'Please analyze the attached file.';
    setMessages((prev) => [...prev, { role: 'user', content: userContent, attachments: outgoingAttachments }]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      const activeConversationId = await getConversationId();
      const data = await aiService.sendChatbotMessage(activeConversationId, userContent, outgoingAttachments);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI request failed';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I could not reach the AI service. Please make sure you are signed in and Ollama is running, then try again.\n\nDetails: ' + message,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const bubbleClass = (role: Message['role']) => [
    'max-w-[80%] rounded-2xl px-4 py-3',
    role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
  ].join(' ');

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
              <p className="text-muted-foreground mt-2 max-w-md">Ask naturally, add files when useful, and get a direct assistant-style response.</p>
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
                <div key={i} className={['flex gap-3', msg.role === 'user' ? 'justify-end' : ''].join(' ')}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={bubbleClass(msg.role)}>
                    <AIMessageContent content={msg.content} />
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.attachments.map((file, index) => (
                          <span key={index} className="rounded-full bg-background/20 px-2.5 py-1 text-xs">
                            {file.type} · {file.name}
                          </span>
                        ))}
                      </div>
                    )}
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
          <div className="max-w-3xl mx-auto space-y-2">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <span key={index} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                    {file.type} · {file.name} · {formatSize(file.size)}
                    <button type="button" onClick={() => removeAttachment(index)} className="text-foreground hover:text-destructive" aria-label="Remove attachment">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input ref={fileInputRef} type="file" accept="image/*,audio/*,video/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading} size="icon">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input placeholder="Ask anything..." className="flex-1" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
              <Button onClick={handleSend} disabled={(!input.trim() && attachments.length === 0) || isLoading} size="icon"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
