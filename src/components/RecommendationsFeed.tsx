import { useState } from 'react';
import { Recommendation, User, Content } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ChatSystem } from './ChatSystem';
import { Star, MessageSquare, Heart, Share2, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RecommendationsFeedProps {
  recommendations: Recommendation[];
  users: User[];
  content: Content[];
  currentUserId: string;
  onContentClick?: (content: Content) => void;
}

export function RecommendationsFeed({ 
  recommendations, 
  users, 
  content, 
  currentUserId,
  onContentClick 
}: RecommendationsFeedProps) {
  const [likedRecommendations, setLikedRecommendations] = useState<Set<string>>(new Set());
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const formatTime = (timestamp: string) => {
    const time = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleLike = (recommendationId: string) => {
    setLikedRecommendations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recommendationId)) {
        newSet.delete(recommendationId);
      } else {
        newSet.add(recommendationId);
      }
      return newSet;
    });
  };

  const handleShare = (recommendation: Recommendation, contentItem: Content) => {
    if (navigator.share) {
      navigator.share({
        title: `${contentItem.title} - Recommended by ${users.find(u => u.id === recommendation.fromUserId)?.displayName}`,
        text: recommendation.message,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Check out this recommendation: ${contentItem.title} - "${recommendation.message}"`
      );
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl">Recommendations from Friends</h2>
      
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const fromUser = users.find(u => u.id === rec.fromUserId);
          const contentItem = content.find(c => c.id === rec.contentId);
          
          if (!fromUser || !contentItem) return null;
          
          return (
            <Card key={rec.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-3 md:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  {/* User Avatar */}
                  <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                    <AvatarImage src={fromUser.avatar} alt={fromUser.displayName} />
                    <AvatarFallback>{fromUser.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium truncate">{fromUser.displayName}</span>
                        <span className="text-muted-foreground text-sm hidden sm:inline">recommends</span>
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          {contentItem.type}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground sm:ml-auto">
                        {formatTime(rec.timestamp)}
                      </span>
                    </div>
                    
                    {/* Mobile "recommends" text */}
                    <div className="sm:hidden mb-2">
                      <span className="text-muted-foreground text-sm">recommends</span>
                    </div>
                    
                    {/* Recommendation Message */}
                    <p className="text-sm text-muted-foreground mb-4 break-words">
                      "{rec.message}"
                    </p>
                    
                    {/* Content Preview */}
                    <div 
                      className="flex flex-col sm:flex-row gap-3 p-3 md:p-4 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => onContentClick?.(contentItem)}
                    >
                      <ImageWithFallback
                        src={contentItem.poster}
                        alt={contentItem.title}
                        className="w-full sm:w-16 md:w-20 h-48 sm:h-24 md:h-28 object-cover rounded flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <h4 className="font-medium truncate">{contentItem.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {contentItem.year} • {contentItem.genre.slice(0, 2).join(', ')}
                        </p>
                        
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                          <span className="text-sm">{contentItem.rating}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            ({contentItem.totalRatings.toLocaleString()})
                          </span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2 hidden sm:block">
                          {contentItem.description}
                        </p>
                        
                        {/* Engagement Stats */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-muted-foreground">
                          <span className="whitespace-nowrap">{contentItem.stats.watched.toLocaleString()} watched</span>
                          <span className="whitespace-nowrap">{contentItem.stats.watching.toLocaleString()} watching</span>
                          <span className="whitespace-nowrap hidden sm:inline">{contentItem.stats.watchlist.toLocaleString()} watchlist</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleLike(rec.id)}
                        className={`${likedRecommendations.has(rec.id) ? 'text-red-500' : ''} text-xs px-3`}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${likedRecommendations.has(rec.id) ? 'fill-red-500' : ''}`} />
                        <span className="hidden sm:inline">{likedRecommendations.has(rec.id) ? 'Liked' : 'Like'}</span>
                        <span className="sm:hidden">{likedRecommendations.has(rec.id) ? '❤️' : '🤍'}</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveChatId(rec.id)}
                        className="text-xs px-3"
                      >
                        <MessageSquare className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Chat</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShare(rec, contentItem)}
                        className="text-xs px-3"
                      >
                        <Share2 className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Share</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onContentClick?.(contentItem)}
                        className="text-xs px-3"
                      >
                        <Eye className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Chat System */}
      {activeChatId && (
        <ChatSystem
          recommendationId={activeChatId}
          users={users}
          currentUserId={currentUserId}
          isOpen={true}
          onClose={() => setActiveChatId(null)}
        />
      )}
    </div>
  );
}