import { UserActivity, User, Content } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Star, Clock, Plus, MessageSquare } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { StaggerContainer, StaggerItem } from './PageTransition';

interface ActivityFeedProps {
  activities: UserActivity[];
  users: User[];
  content: Content[];
}

export function ActivityFeed({ activities, users, content }: ActivityFeedProps) {
  const getActivityText = (activity: UserActivity) => {
    switch (activity.type) {
      case 'watched':
        return 'finished watching';
      case 'watching':
        return 'started watching';
      case 'added_to_watchlist':
        return 'added to watchlist';
      case 'rated':
        return 'rated';
      case 'reviewed':
        return 'reviewed';
      default:
        return 'interacted with';
    }
  };

  const getActivityColor = (type: UserActivity['type']) => {
    switch (type) {
      case 'watched':
        return 'bg-green-100 text-green-800';
      case 'watching':
        return 'bg-blue-100 text-blue-800';
      case 'added_to_watchlist':
        return 'bg-yellow-100 text-yellow-800';
      case 'rated':
        return 'bg-purple-100 text-purple-800';
      case 'reviewed':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    const time = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl">Recent Activity</h2>
      </motion.div> */}
      
      <StaggerContainer className="space-y-3" staggerChildren={0.1}>
        {activities.map((activity, index) => {
          const user = users.find(u => u.id === activity.userId);
          const contentItem = content.find(c => c.id === activity.contentId);
          
          if (!user || !contentItem) return null;
          
          return (
            <StaggerItem key={activity.id} index={index}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.displayName} />
                    <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{user.displayName}</span>
                      <Badge className={`text-xs ${getActivityColor(activity.type)}`}>
                        {activity.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {getActivityText(activity)} <span className="">{contentItem.title}</span>
                      {activity.rating && (
                        <span className="ml-1 inline-flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {activity.rating}
                        </span>
                      )}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={contentItem.poster}
                        alt={contentItem.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{contentItem.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {contentItem.year} • {contentItem.genre[0]}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{contentItem.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );
}