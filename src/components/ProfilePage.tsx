import { useState } from 'react';
import { User, Content, Review } from '../types';
import { ContentCard } from './ContentCard';
import { SwipeableTabs } from './SwipeableTabs';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { 
  User as UserIcon, 
  Settings, 
  Edit,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Star,
  Eye,
  Clock,
  BookOpen,
  Heart,
  MessageSquare,
  Share,
  MoreHorizontal,
  Trophy,
  Target,
  TrendingUp,
  BarChart3,
  PlayCircle,
  StarIcon
} from 'lucide-react';

interface ProfilePageProps {
  users: User[];
  content: Content[];
  reviews: Review[];
  currentUserId: string;
  isOwnProfile?: boolean;
  profileUserId?: string;
  onContentClick: (content: Content) => void;
}

export function ProfilePage({ 
  users, 
  content, 
  reviews, 
  currentUserId, 
  isOwnProfile = true,
  profileUserId,
  onContentClick 
}: ProfilePageProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);

  const targetUserId = isOwnProfile ? currentUserId : profileUserId;
  const user = users.find(u => u.id === targetUserId);
  const userReviews = reviews.filter(r => r.userId === targetUserId);

  if (!user) return null;

  // Mock profile data - in real app, this would come from user's actual data
  const profileStats = {
    totalWatched: 156,
    currentlyWatching: 8,
    watchlistItems: 23,
    avgRating: 4.2,
    totalReviews: userReviews.length,
    totalLikes: userReviews.reduce((sum, review) => sum + review.likes, 0),
    joinDate: '2023-06-15',
    location: 'San Francisco, CA',
    website: 'https://example.com'
  };

  const achievements = [
    { id: 1, title: 'Movie Buff', description: 'Watched 100+ movies', icon: '🎬', earned: true },
    { id: 2, title: 'Critic', description: 'Written 50+ reviews', icon: '✍️', earned: true },
    { id: 3, title: 'Social Butterfly', description: '100+ followers', icon: '🦋', earned: false },
    { id: 4, title: 'Binge Watcher', description: 'Watched 10 series', icon: '📺', earned: true },
  ];

  const currentGoals = [
    { title: 'Watch 10 movies this month', progress: 70, current: 7, target: 10 },
    { title: 'Read 5 books this quarter', progress: 40, current: 2, target: 5 },
    { title: 'Write 20 reviews', progress: 85, current: 17, target: 20 },
  ];

  const favoriteGenres = [
    { genre: 'Sci-Fi', count: 23 },
    { genre: 'Drama', count: 18 },
    { genre: 'Thriller', count: 15 },
    { genre: 'Comedy', count: 12 },
    { genre: 'Action', count: 10 },
  ];

  // Mock user's content activity
  const watchedContent = content.slice(0, 6);
  const watchingContent = content.slice(2, 5);
  const favoriteContent = content.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback className="text-2xl">{user.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              {isOwnProfile ? (
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl">{user.displayName}</h1>
                  <p className="text-muted-foreground text-lg">@{user.username}</p>
                </div>
                {isOwnProfile && (
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <p className="text-muted-foreground mb-4">{user.bio}</p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profileStats.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(profileStats.joinDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  <a href={profileStats.website} className="text-primary hover:underline">
                    website
                  </a>
                </div>
              </div>

              {/* Follow Stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl">{profileStats.totalWatched}</div>
                  <p className="text-xs text-muted-foreground">Watched</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl">{user.followersCount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl">{user.followingCount}</div>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500" />
                    {profileStats.avgRating}
                  </div>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="text-xl">{profileStats.totalWatched}</div>
            <p className="text-xs text-muted-foreground">Watched</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-xl">{profileStats.currentlyWatching}</div>
            <p className="text-xs text-muted-foreground">Watching</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <div className="text-xl">{profileStats.watchlistItems}</div>
            <p className="text-xs text-muted-foreground">Watchlist</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <div className="text-xl">{profileStats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
            <div className="text-xl">{profileStats.totalLikes}</div>
            <p className="text-xs text-muted-foreground">Likes</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SwipeableTabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            tabs={[
              {
                value: "overview",
                label: "Overview",
                icon: <BarChart3 className="w-4 h-4" />,
                content: (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {watchedContent.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                                 onClick={() => onContentClick(item)}>
                              <img 
                                src={item.poster} 
                                alt={item.title}
                                className="w-12 h-16 rounded object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-muted-foreground">Watched • 2 days ago</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-3 h-3 text-yellow-500" />
                                  <span className="text-xs">{item.rating}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Goals Progress */}
                    {isOwnProfile && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Current Goals
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {currentGoals.map((goal, index) => (
                              <div key={index}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{goal.title}</span>
                                  <span>{goal.current}/{goal.target}</span>
                                </div>
                                <Progress value={goal.progress} />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )
              },
              {
                value: "watched",
                label: "Watched",
                icon: <Eye className="w-4 h-4" />,
                content: (
                  <div className="grid gap-4">
                    {watchedContent.map((item) => (
                      <ContentCard
                        key={item.id}
                        content={item}
                        onCardClick={onContentClick}
                        compact={true}
                      />
                    ))}
                  </div>
                )
              },
              {
                value: "watching",
                label: "Watching",
                icon: <PlayCircle className="w-4 h-4" />,
                content: (
                  <div className="grid gap-4">
                    {watchingContent.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <ContentCard
                          content={item}
                          onCardClick={onContentClick}
                          compact={true}
                        />
                        <div className="px-4">
                          <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>65%</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )
              },
              {
                value: "reviews",
                label: "Reviews",
                icon: <MessageSquare className="w-4 h-4" />,
                content: (
                  <div className="space-y-4">
                    {userReviews.map((review) => {
                      const reviewContent = content.find(c => c.id === review.contentId);
                      return (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              {reviewContent && (
                                <img 
                                  src={reviewContent.poster} 
                                  alt={reviewContent.title}
                                  className="w-16 h-20 rounded object-cover cursor-pointer"
                                  onClick={() => onContentClick(reviewContent)}
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-medium">{reviewContent?.title}</h3>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                  <div className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    {review.likes}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )
              },
              {
                value: "favorites",
                label: "Favorites",
                icon: <StarIcon className="w-4 h-4" />,
                content: (
                  <div className="grid gap-4">
                    {favoriteContent.map((item) => (
                      <ContentCard
                        key={item.id}
                        content={item}
                        onCardClick={onContentClick}
                        compact={true}
                      />
                    ))}
                  </div>
                )
              }
            ]}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-3 rounded-lg border text-center ${
                      achievement.earned ? 'bg-primary/10 border-primary/20' : 'bg-muted/50 border-muted'
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <p className="text-xs font-medium">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Favorite Genres */}
          <Card>
            <CardHeader>
              <CardTitle>Favorite Genres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {favoriteGenres.map((item) => (
                  <div key={item.genre} className="flex justify-between items-center">
                    <span className="text-sm">{item.genre}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Year in Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                2024 in Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Movies watched</span>
                  <span className="font-medium">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Books read</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Hours spent</span>
                  <span className="font-medium">342h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Reviews written</span>
                  <span className="font-medium">47</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}