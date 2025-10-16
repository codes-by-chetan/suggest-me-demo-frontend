import { useState } from 'react';
import { Content, WatchStatus } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Film, 
  Music, 
  Tv, 
  Mic, 
  Star, 
  Plus, 
  Check, 
  Clock, 
  Heart, 
  X 
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ContentCardProps {
  content: Content;
  onCardClick?: (content: Content) => void;
  compact?: boolean;
}

const getTypeIcon = (type: Content['type']) => {
  switch (type) {
    case 'movie': return <Film className="w-4 h-4" />;
    case 'series': return <Tv className="w-4 h-4" />;
    case 'book': return <BookOpen className="w-4 h-4" />;
    case 'music': return <Music className="w-4 h-4" />;
    case 'podcast': return <Mic className="w-4 h-4" />;
    default: return <Film className="w-4 h-4" />;
  }
};

const getStatusColor = (status: WatchStatus) => {
  switch (status) {
    case 'watched': return 'bg-green-500';
    case 'watching': return 'bg-blue-500';
    case 'watchlist': return 'bg-yellow-500';
    case 'interested': return 'bg-purple-500';
    case 'not_interested': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

// Get aspect ratio class based on content type
const getAspectRatio = (type: Content['type']) => {
  switch (type) {
    case 'music': 
      return 'aspect-square'; // 1:1 for music albums
    case 'movie':
    case 'series':
    case 'book':
    case 'podcast':
    default:
      return 'aspect-[2/3]'; // 2:3 for movies, books, series, podcasts
  }
};

export function ContentCard({ content, onCardClick, compact = false }: ContentCardProps) {
  const [watchStatus, setWatchStatus] = useState<WatchStatus>(null);

  const handleStatusChange = (status: WatchStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchStatus(status === watchStatus ? null : status);
  };

  const handleCardClick = () => {
    onCardClick?.(content);
  };

  // List view layout (compact = true)
  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Card className="group cursor-pointer hover:shadow-lg transition-all w-full" onClick={handleCardClick}>
        <CardContent className="p-0">
          <div className="flex gap-3 p-3">
            {/* Image Container - Left side in list view */}
            <div className="relative flex-shrink-0">
              <div className={`w-16 sm:w-20 ${getAspectRatio(content.type)} relative overflow-hidden rounded-lg`}>
                <ImageWithFallback
                  src={content.poster}
                  alt={content.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Watch Status Indicator */}
                {watchStatus && (
                  <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getStatusColor(watchStatus)}`} />
                )}
                
                {/* Type Badge */}
                <Badge className="absolute top-1 left-1 text-xs px-1 py-0.5" variant="secondary">
                  {getTypeIcon(content.type)}
                </Badge>
              </div>
              
              {/* Quick Actions Overlay - smaller for list view */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={watchStatus === 'watched' ? 'default' : 'secondary'}
                    onClick={(e) => handleStatusChange('watched', e)}
                    className="h-6 w-6 p-0"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={watchStatus === 'watching' ? 'default' : 'secondary'}
                    onClick={(e) => handleStatusChange('watching', e)}
                    className="h-6 w-6 p-0"
                  >
                    <Clock className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={watchStatus === 'watchlist' ? 'default' : 'secondary'}
                    onClick={(e) => handleStatusChange('watchlist', e)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Content Area - Right side in list view */}
            <div className="flex-1 min-w-0 py-1">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-medium line-clamp-1 flex-1">{content.title}</h3>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">{content.rating}</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mb-1">
                {content.year} • {content.genre.slice(0, 2).join(', ')}
              </p>
              
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {content.description}
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{content.stats.watched.toLocaleString()} watched</span>
                <span className="hidden sm:inline">{content.stats.watching.toLocaleString()} watching</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    );
  }

  // Grid view layout (compact = false)
  return (
    <motion.div
      whileHover={{ 
        scale: 1.03, 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card className="group cursor-pointer hover:shadow-lg transition-all w-full max-w-sm mx-auto" onClick={handleCardClick}>
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image Container - Top in grid view with fixed height */}
        <div className="relative flex-shrink-0">
          <div className="w-full h-48 sm:h-56 relative overflow-hidden rounded-t-lg bg-muted">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className={`${getAspectRatio(content.type)} ${getAspectRatio(content.type) === 'aspect-square' ? 'w-full max-w-[60%]' : 'h-full max-h-full'} relative overflow-hidden rounded shadow-md`}>
                <ImageWithFallback
                  src={content.poster}
                  alt={content.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Watch Status Indicator */}
            {watchStatus && (
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusColor(watchStatus)}`} />
            )}
            
            {/* Type Badge */}
            <Badge className="absolute top-2 left-2" variant="secondary">
              {getTypeIcon(content.type)}
              <span className="ml-1 capitalize">{content.type}</span>
            </Badge>
            
            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={watchStatus === 'watched' ? 'default' : 'secondary'}
                  onClick={(e) => handleStatusChange('watched', e)}
                  className="h-8 w-8 p-0"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={watchStatus === 'watching' ? 'default' : 'secondary'}
                  onClick={(e) => handleStatusChange('watching', e)}
                  className="h-8 w-8 p-0"
                >
                  <Clock className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={watchStatus === 'watchlist' ? 'default' : 'secondary'}
                  onClick={(e) => handleStatusChange('watchlist', e)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={watchStatus === 'interested' ? 'default' : 'secondary'}
                  onClick={(e) => handleStatusChange('interested', e)}
                  className="h-8 w-8 p-0"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={watchStatus === 'not_interested' ? 'destructive' : 'secondary'}
                  onClick={(e) => handleStatusChange('not_interested', e)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Area - Bottom in grid view with fixed height */}
        <div className="p-3 flex-1 flex flex-col min-h-[120px]">
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="text-sm font-medium line-clamp-2 flex-1">{content.title}</h3>
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground">{content.rating}</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mb-1.5">
            {content.year} • {content.genre.slice(0, 2).join(', ')}
          </p>
          
          <p className="text-xs text-muted-foreground line-clamp-2 mb-auto">
            {content.description}
          </p>
          
          {/* Stats */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
            <span className="truncate">{content.stats.watched.toLocaleString()} watched</span>
            <span className="hidden sm:inline truncate">{content.stats.watching.toLocaleString()} watching</span>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}