import { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatConversation, User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  MessageSquare, 
  Send, 
  Heart, 
  Reply, 
  MoreVertical,
  Pin,
  Flag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ChatSystemProps {
  recommendationId: string;
  users: User[];
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSystem({ 
  recommendationId, 
  users, 
  currentUserId, 
  isOpen, 
  onClose 
}: ChatSystemProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '2',
      recommendationId,
      message: 'This looks amazing! I\'ve been wanting to watch something like this.',
      timestamp: '2024-03-15T10:30:00Z',
      likes: 3,
      isLiked: false
    },
    {
      id: '2',
      userId: '1',
      recommendationId,
      message: 'Right? The cinematography is absolutely stunning. Denis Villeneuve really knows how to create atmosphere.',
      timestamp: '2024-03-15T10:35:00Z',
      likes: 2,
      isLiked: true,
      replyTo: '1'
    },
    {
      id: '3',
      userId: '3',
      recommendationId,
      message: 'Just finished watching it. Mind = blown 🤯',
      timestamp: '2024-03-15T14:20:00Z',
      likes: 5,
      isLiked: false
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUserId,
      recommendationId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replyTo: replyingTo || undefined
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setReplyingTo(null);
  };

  const handleLikeMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1,
            isLiked: !msg.isLiked 
          }
        : msg
    ));
  };

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: string) => {
    const time = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return time.toLocaleDateString();
  };

  const getReplyingToMessage = (replyId: string) => {
    return messages.find(msg => msg.id === replyId);
  };

  const getUser = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed inset-4 md:inset-auto md:right-4 md:bottom-4 md:top-4 md:w-96 z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Discussion
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const user = getUser(message.userId);
              const replyingToMsg = message.replyTo ? getReplyingToMessage(message.replyTo) : null;
              const replyingToUser = replyingToMsg ? getUser(replyingToMsg.userId) : null;
              
              if (!user) return null;

              return (
                <div key={message.id} className="group">
                  {/* Reply context */}
                  {replyingToMsg && replyingToUser && (
                    <div className="ml-4 mb-1 p-2 bg-muted/50 rounded text-xs text-muted-foreground border-l-2 border-primary/20">
                      <span className="">Replying to {replyingToUser.displayName}:</span>
                      <p className="truncate">{replyingToMsg.message}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} alt={user.displayName} />
                      <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{user.displayName}</span>
                        {message.userId === currentUserId && (
                          <Badge variant="secondary" className="text-xs px-1">You</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-auto w-auto p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleReply(message.id)}>
                              <Reply className="w-4 h-4 mr-2" />
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pin className="w-4 h-4 mr-2" />
                              Pin Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Flag className="w-4 h-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <p className="text-sm mb-2">{message.message}</p>
                      
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 text-xs"
                          onClick={() => handleLikeMessage(message.id)}
                        >
                          <Heart className={`w-3 h-3 mr-1 ${message.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                          {message.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 text-xs"
                          onClick={() => handleReply(message.id)}
                        >
                          <Reply className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <Separator />
        
        {/* Reply indicator */}
        {replyingTo && (
          <div className="px-4 py-2 bg-muted/50 border-l-2 border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Replying to {getUser(getReplyingToMessage(replyingTo)?.userId || '')?.displayName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto w-auto p-1"
                onClick={() => setReplyingTo(null)}
              >
                ✕
              </Button>
            </div>
          </div>
        )}
        
        {/* Message Input */}
        <div className="p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}