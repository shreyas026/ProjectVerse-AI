import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockConversations, mockUser } from '@/services/mockData';
import { Search, Send, Phone, Video, MoreVertical, Smile, Paperclip, Image, ChevronLeft } from 'lucide-react';

export function MessagesPage() {
  const [activeConv, setActiveConv] = useState(mockConversations[0]._id);
  const [messageText, setMessageText] = useState('');
  const conversations = mockConversations;
  const activeConversation = conversations.find((c) => c._id === activeConv);

  const otherParticipant = activeConversation?.type === 'direct'
    ? activeConversation.participants.find((p) => p._id !== '1')
    : undefined;

  return (
    <div className="h-[calc(100vh-8rem)] -mx-4 lg:-mx-8 -mt-4">
      <div className="h-full flex flex-col lg:flex-row">
        {/* Conversation List */}
        <div className={`w-full lg:w-80 border-r flex flex-col ${activeConv ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Messages</h2>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {conversations.map((conv) => {
              const isActive = conv._id === activeConv;
              const other = conv.type === 'direct' ? conv.participants.find((p) => p._id !== '1') : undefined;
              return (
                <button
                  key={conv._id}
                  onClick={() => setActiveConv(conv._id)}
                  className={`w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-accent ${isActive ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                >
                  <div className="relative">
                    <Avatar className="w-11 h-11">
                      <AvatarImage src={other?.avatar || conv.avatar} />
                      <AvatarFallback>{(conv.name || other?.firstName)?.[0]}</AvatarFallback>
                    </Avatar>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{conv.name || `${other?.firstName} ${other?.lastName}`}</p>
                      {conv.lastMessage && (
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                          {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage.content}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {activeConversation && (
          <div className={`flex-1 flex flex-col ${!activeConv ? 'hidden lg:flex' : 'flex'}`}>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setActiveConv('')}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={otherParticipant?.avatar || activeConversation.avatar} />
                <AvatarFallback>{(activeConversation.name || otherParticipant?.firstName)?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{activeConversation.name || `${otherParticipant?.firstName} ${otherParticipant?.lastName}`}</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9"><Phone className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-9 w-9"><Video className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-9 w-9"><MoreVertical className="w-4 h-4" /></Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <div className="text-center py-4"><Badge variant="secondary">Today</Badge></div>
                {activeConversation.lastMessage && (
                  <div className={`flex ${activeConversation.lastMessage.sender._id === '1' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${activeConversation.lastMessage.sender._id === '1' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'}`}>
                      <p className="text-sm">{activeConversation.lastMessage.content}</p>
                      <p className="text-[10px] opacity-70 mt-1 text-right">{new Date(activeConversation.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0"><Paperclip className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0"><Image className="w-4 h-4" /></Button>
                <Input placeholder="Type a message..." className="flex-1" value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && messageText.trim()) { setMessageText(''); } }} />
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0"><Smile className="w-4 h-4" /></Button>
                <Button size="icon" className="h-9 w-9 shrink-0" disabled={!messageText.trim()}><Send className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
