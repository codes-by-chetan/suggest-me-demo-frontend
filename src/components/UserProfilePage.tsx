import { useState } from 'react';
import { User, Content, Review } from '../types';
import { ContentCard } from './ContentCard';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
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
  Users,
  UserPlus,
  UserMinus,
  ArrowLeft,
  Save,
  Camera
} from 'lucide-react';

interface UserProfilePageProps {
  users: User[];
  content: Content[];
  reviews: Review[];
  currentUserId: string;
  profileUserId: string;
  followedUsers: Set<string>;
  onContentClick: (content: Content) => void;
  onFollowUser: (userId: string) => void;
  onBack: () => void;
}

export function UserProfilePage({ 
  users, 
  content, 
  reviews, 
  currentUserId, 
  profileUserId,
  followedUsers,
  onContentClick,
  onFollowUser,
  onBack
}: UserProfilePageProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  // Edit profile state
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: ''
  });

  const isOwnProfile = currentUserId === profileUserId;
  const user = users.find(u => u.id === profileUserId);
  const userReviews = reviews.filter(r => r.userId === profileUserId);
  const isFollowing = followedUsers.has(profileUserId);

  if (!user) return null;

  // Initialize edit form when opening dialog
  const handleEditProfile = () => {
    setEditForm({
      displayName: user.displayName,
      bio: user.bio || '',
      location: profileStats.location,
      website: profileStats.website
    });
    setShowEditProfile(true);
  };

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

  // Mock followers/following data
  const followersList = users.slice(1, 4).map(u => ({ ...u, isFollowing: followedUsers.has(u.id) }));
  const followingList = users.slice(0, 3).map(u => ({ ...u, isFollowing: true }));

  const achievements = [
    { id: 1, title: 'Movie Buff', description: 'Watched 100+ movies', icon: '🎬', earned: true },
    { id: 2, title: 'Critic', description: 'Written 50+ reviews', icon: '✍️', earned: true },
    { id: 3, title: 'Social Butterfly', description: '100+ followers', icon: '🦋', earned: user.followersCount > 100 },
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
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={user.avatar} alt={user.displayName} />
                  <AvatarFallback className="text-2xl">{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Button
                    size="sm"
                    className="absolute bottom-4 right-0 rounded-full w-8 h-8 p-0"
                    onClick={handleEditProfile}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {isOwnProfile ? (
                <Button variant="outline" className="flex items-center gap-2" onClick={handleEditProfile}>
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    onClick={() => onFollowUser(profileUserId)}
                    className="flex items-center gap-2"
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                      </>
                    )}
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
                <button 
                  className="text-center hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  onClick={() => setShowFollowers(true)}
                >
                  <div className="text-2xl">{user.followersCount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </button>
                <button 
                  className="text-center hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  onClick={() => setShowFollowing(true)}
                >
                  <div className="text-2xl">{user.followingCount}</div>
                  <p className="text-xs text-muted-foreground">Following</p>
                </button>
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
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="watched">Watched</TabsTrigger>
              <TabsTrigger value="watching">Watching</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Recent Activity */}
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

              {/* Goals Progress - Only for own profile */}
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
            </TabsContent>

            <TabsContent value="watched" className="mt-6">
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
            </TabsContent>

            <TabsContent value="watching" className="mt-6">
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
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
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
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
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
            </TabsContent>
          </Tabs>
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

      {/* Followers Dialog */}
      <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-3">
              {followersList.map((follower) => (
                <div key={follower.id} className="flex items-center gap-3 p-2 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={follower.avatar} alt={follower.displayName} />
                    <AvatarFallback>{follower.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{follower.displayName}</p>
                    <p className="text-sm text-muted-foreground">@{follower.username}</p>
                  </div>
                  {follower.id !== currentUserId && (
                    <Button
                      size="sm"
                      variant={follower.isFollowing ? "outline" : "default"}
                      onClick={() => onFollowUser(follower.id)}
                    >
                      {follower.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Following Dialog */}
      <Dialog open={showFollowing} onOpenChange={setShowFollowing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Following</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-3">
              {followingList.map((following) => (
                <div key={following.id} className="flex items-center gap-3 p-2 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={following.avatar} alt={following.displayName} />
                    <AvatarFallback>{following.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{following.displayName}</p>
                    <p className="text-sm text-muted-foreground">@{following.username}</p>
                  </div>
                  {following.id !== currentUserId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onFollowUser(following.id)}
                    >
                      Following
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={editForm.displayName}
                onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Your display name"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell people about yourself"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editForm.location}
                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Where you're located"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={editForm.website}
                onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                placeholder="Your website URL"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                className="flex-1"
                onClick={() => {
                  // In real app, save changes here
                  setShowEditProfile(false);
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setShowEditProfile(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}