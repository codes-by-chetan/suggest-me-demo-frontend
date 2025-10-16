import { useState } from 'react';
import { User, Content } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Star, 
  BookmarkPlus,
  Clock,
  X,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'recommendation' | 'review' | 'watchlist';
  title: string;
  message: string;
  time: string;
  userId?: string;
  contentId?: string;
  isRead: boolean;
  avatar?: string;
}

interface NotificationsPopupProps {
  users: User[];
  content: Content[];
  currentUserId: string;
  onViewAll: () => void;
  onClose: () => void;
  isOpen: boolean;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'Sarah liked your review',
    message: 'Sarah Connor liked your review of "Dune: Part Two"',
    time: '2 minutes ago',
    userId: '2',
    contentId: '1',
    isRead: false,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150'
  },
  {
    id: '2',
    type: 'comment',
    title: 'New comment on your review',
    message: 'Alex Thompson commented on your "The Bear" review',
    time: '15 minutes ago',
    userId: '3',
    contentId: '2',
    isRead: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: '3',
    type: 'follow',
    title: 'New follower',
    message: 'Maria Garcia started following you',
    time: '1 hour ago',
    userId: '4',
    isRead: false,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
  },
  {
    id: '4',
    type: 'recommendation',
    title: 'New recommendation',
    message: 'John recommended "Breaking Bad" to you',
    time: '2 hours ago',
    userId: '5',
    contentId: '3',
    isRead: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: '5',
    type: 'watchlist',
    title: 'Watchlist update',
    message: 'Sarah added "Stranger Things" to her watchlist',
    time: '3 hours ago',
    userId: '2',
    contentId: '4',
    isRead: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150'
  }
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'like': return <Heart className="w-4 h-4 text-red-500" />;
    case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case 'follow': return <UserPlus className="w-4 h-4 text-green-500" />;
    case 'recommendation': return <Star className="w-4 h-4 text-yellow-500" />;
    case 'review': return <Star className="w-4 h-4 text-purple-500" />;
    case 'watchlist': return <BookmarkPlus className="w-4 h-4 text-orange-500" />;
    default: return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

export function NotificationsPopup({ 
  users, 
  content, 
  currentUserId, 
  onViewAll, 
  onClose, 
  isOpen 
}: NotificationsPopupProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isClearing, setIsClearing] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 5);

  const handleClearAll = async () => {
    setIsClearing(true);
    
    // Animate out notifications one by one
    for (let i = 0; i < notifications.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setNotifications(prev => prev.filter((_, index) => index !== 0));
    }
    
    setIsClearing(false);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md mx-4"
      >
        <Card className="shadow-lg border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 px-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-1">
                <AnimatePresence mode="popLayout">
                  {recentNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ 
                        opacity: 0, 
                        x: 20, 
                        scale: 0.95,
                        transition: { duration: 0.2 }
                      }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.05 
                      }}
                      className={`flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                        !notification.isRead ? 'bg-muted/30' : ''
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <img
                          src={notification.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium line-clamp-1">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.time}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getNotificationIcon(notification.type)}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {notifications.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">All caught up!</p>
                    <p className="text-xs text-muted-foreground mt-1">No new notifications</p>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
            
            {/* Footer Actions */}
            {notifications.length > 0 && (
              <>
                <Separator />
                <div className="p-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onViewAll}
                    className="flex-1"
                  >
                    View All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    disabled={isClearing}
                    className="flex-1"
                  >
                    {isClearing ? 'Clearing...' : 'Clear All'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}