import { useState } from 'react';
import { Content, Review, User, WatchStatus } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { ChatSystem } from './ChatSystem';
import { 
  Star, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Clock, 
  Check, 
  Plus,
  ThumbsUp,
  X,
  Send,
  BookOpen, 
  Film, 
  Music, 
  Tv, 
  Mic,
  Play,
  ShoppingCart,
  Download,
  ExternalLink
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ContentDetailsProps {
  content: Content;
  reviews: Review[];
  users: User[];
  currentUserId: string;
  onBack?: () => void;
}

const getTypeIcon = (type: Content['type']) => {
  switch (type) {
    case 'movie': return <Film className="w-5 h-5" />;
    case 'series': return <Tv className="w-5 h-5" />;
    case 'book': return <BookOpen className="w-5 h-5" />;
    case 'music': return <Music className="w-5 h-5" />;
    case 'podcast': return <Mic className="w-5 h-5" />;
    default: return <Film className="w-5 h-5" />;
  }
};

export function ContentDetails({ content, reviews, users, currentUserId, onBack }: ContentDetailsProps) {
  const [watchStatus, setWatchStatus] = useState<WatchStatus>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const contentReviews = reviews.filter(r => r.contentId === content.id);
  const totalEngagement = Object.values(content.stats).reduce((sum, count) => sum + count, 0);

  // Mock streaming/purchase links
  const streamingLinks = [
    { name: 'Netflix', url: '#', type: 'stream', price: 'Included' },
    { name: 'Amazon Prime', url: '#', type: 'stream', price: 'Included' },
    { name: 'Disney+', url: '#', type: 'stream', price: 'Included' },
    { name: 'Apple TV', url: '#', type: 'rent', price: '$3.99' },
    { name: 'Google Play', url: '#', type: 'buy', price: '$12.99' },
    { name: 'Amazon', url: '#', type: 'buy', price: '$11.99' }
  ];

  const handleSubmitReview = () => {
    if (reviewText.trim() && userRating > 0) {
      // In a real app, this would submit to the backend
      console.log('Submitting review:', { rating: userRating, comment: reviewText });
      setReviewText('');
      setUserRating(0);
      setShowReviewForm(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="px-2">
            ← Back
          </Button>
        )}
        <h1 className="text-xl md:text-2xl">Content Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Poster and Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4 md:p-6">
              <ImageWithFallback
                src={content.poster}
                alt={content.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg mb-4"
              />
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={watchStatus === 'watched' ? 'default' : 'outline'}
                    onClick={() => setWatchStatus(watchStatus === 'watched' ? null : 'watched')}
                    className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4"
                    size="sm"
                  >
                    <Check className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Watched</span>
                    <span className="sm:hidden">✓</span>
                  </Button>
                  <Button
                    variant={watchStatus === 'watching' ? 'default' : 'outline'}
                    onClick={() => setWatchStatus(watchStatus === 'watching' ? null : 'watching')}
                    className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4"
                    size="sm"
                  >
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Watching</span>
                    <span className="sm:hidden">👁️</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={watchStatus === 'watchlist' ? 'default' : 'outline'}
                    onClick={() => setWatchStatus(watchStatus === 'watchlist' ? null : 'watchlist')}
                    className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4"
                    size="sm"
                  >
                    <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Watchlist</span>
                    <span className="sm:hidden">+</span>
                  </Button>
                  <Button
                    variant={watchStatus === 'interested' ? 'default' : 'outline'}
                    onClick={() => setWatchStatus(watchStatus === 'interested' ? null : 'interested')}
                    className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4"
                    size="sm"
                  >
                    <Heart className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Interested</span>
                    <span className="sm:hidden">❤️</span>
                  </Button>
                </div>
                
                <Button
                  variant={watchStatus === 'not_interested' ? 'destructive' : 'outline'}
                  onClick={() => setWatchStatus(watchStatus === 'not_interested' ? null : 'not_interested')}
                  className="w-full flex items-center gap-1 md:gap-2 text-xs md:text-sm"
                  size="sm"
                >
                  <X className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Not Interested</span>
                  <span className="sm:hidden">✖️</span>
                </Button>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    Save
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
                
                <Button 
                  className="w-full flex items-center gap-2"
                  onClick={() => setIsChatOpen(true)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Join Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Columns - Content Info and Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Streaming/Purchase Links */}
          <Card>
            <CardHeader>
              <CardTitle>Where to Watch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="mb-2">Stream</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {streamingLinks.filter(link => link.type === 'stream').map((link) => (
                      <Button key={link.name} variant="outline" className="justify-between h-auto p-3" asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <div className="flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            <span>{link.name}</span>
                          </div>
                          <Badge variant="secondary">{link.price}</Badge>
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="mb-2">Rent</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {streamingLinks.filter(link => link.type === 'rent').map((link) => (
                      <Button key={link.name} variant="outline" className="justify-between h-auto p-3" asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            <span>{link.name}</span>
                          </div>
                          <Badge>{link.price}</Badge>
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="mb-2">Buy</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {streamingLinks.filter(link => link.type === 'buy').map((link) => (
                      <Button key={link.name} variant="outline" className="justify-between h-auto p-3" asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            <span>{link.name}</span>
                          </div>
                          <Badge>{link.price}</Badge>
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Information */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{content.title}</CardTitle>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {getTypeIcon(content.type)}
                      <span className="capitalize">{content.type}</span>
                    </div>
                    <span>{content.year}</span>
                    {content.duration && <span>{content.duration}</span>}
                    {content.episodes && <span>{content.episodes} episodes</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl">{content.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {content.totalRatings.toLocaleString()} ratings
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4>Genres</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {content.genre.map((genre) => (
                      <Badge key={genre} variant="secondary">{genre}</Badge>
                    ))}
                  </div>
                </div>
                
                {content.director && (
                  <div>
                    <h4>Director</h4>
                    <p>{content.director}</p>
                  </div>
                )}
                
                {content.author && (
                  <div>
                    <h4>Author</h4>
                    <p>{content.author}</p>
                  </div>
                )}
                
                {content.artist && (
                  <div>
                    <h4>Artist</h4>
                    <p>{content.artist}</p>
                  </div>
                )}
                
                <div>
                  <h4>Description</h4>
                  <p className="text-muted-foreground">{content.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Community Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-2xl text-green-600">{content.stats.watched.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Watched</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(content.stats.watched / totalEngagement) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-blue-600">{content.stats.watching.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Watching</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(content.stats.watching / totalEngagement) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-yellow-600">{content.stats.watchlist.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Watchlist</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${(content.stats.watchlist / totalEngagement) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-purple-600">{content.stats.interested.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Interested</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(content.stats.interested / totalEngagement) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-red-600">{content.stats.notInterested.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Not Interested</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(content.stats.notInterested / totalEngagement) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reviews ({contentReviews.length})</CardTitle>
              <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Write Review
              </Button>
            </CardHeader>
            <CardContent>
              {/* Review Form */}
              {showReviewForm && (
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2">Your Rating</label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[userRating]}
                            onValueChange={(value) => setUserRating(value[0])}
                            max={5}
                            step={0.5}
                            className="flex-1"
                          />
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{userRating}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Your Review</label>
                        <Textarea
                          placeholder="Share your thoughts about this content..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSubmitReview} disabled={!reviewText.trim() || userRating === 0}>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Review
                        </Button>
                        <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {contentReviews.map((review) => {
                  const reviewUser = users.find(u => u.id === review.userId);
                  if (!reviewUser) return null;

                  return (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={reviewUser.avatar} alt={reviewUser.displayName} />
                            <AvatarFallback>{reviewUser.displayName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span>{reviewUser.displayName}</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{review.rating}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{review.comment}</p>
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {review.likes}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Chat System */}
      <ChatSystem
        recommendationId={`content-${content.id}`}
        users={users}
        currentUserId={currentUserId}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}