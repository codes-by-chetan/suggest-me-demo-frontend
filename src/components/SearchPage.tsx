import { useState, useEffect, useCallback } from 'react';
import { Content, User } from '../types';
import { ContentCard } from './ContentCard';
import { SwipeableTabs } from './SwipeableTabs';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { 
  Search, 
  Filter, 
  X,
  Play,
  Book,
  Music,
  Headphones,
  User as UserIcon,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface SearchPageProps {
  content: Content[];
  users: User[];
  onContentClick: (content: Content) => void;
  onUserClick?: (userId: string) => void;
  initialQuery?: string;
}

export function SearchPage({ 
  content, 
  users, 
  onContentClick, 
  onUserClick,
  initialQuery = '' 
}: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTab, setSelectedTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'year' | 'popularity'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [displayedItems, setDisplayedItems] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  const filters = {
    genre: [] as string[],
    year: { min: 2000, max: 2024 },
    rating: { min: 0, max: 5 }
  };

  // Get all unique content types
  const contentTypes = [
    { id: 'all', label: 'All', icon: Grid, count: content.length + users.length },
    { id: 'users', label: 'Users', icon: UserIcon, count: users.length },
    { id: 'movie', label: 'Movies', icon: Play, count: content.filter(c => c.type === 'movie').length },
    { id: 'series', label: 'Series', icon: Play, count: content.filter(c => c.type === 'series').length },
    { id: 'book', label: 'Books', icon: Book, count: content.filter(c => c.type === 'book').length },
    { id: 'music', label: 'Music', icon: Music, count: content.filter(c => c.type === 'music').length },
    { id: 'podcast', label: 'Podcasts', icon: Headphones, count: content.filter(c => c.type === 'podcast').length },
  ];

  // Filter and search functions
  const searchInContent = (content: Content[], query: string) => {
    if (!query.trim()) return content;
    const lowerQuery = query.toLowerCase();
    return content.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.genre.some(g => g.toLowerCase().includes(lowerQuery)) ||
      (item.director && item.director.toLowerCase().includes(lowerQuery)) ||
      (item.author && item.author.toLowerCase().includes(lowerQuery)) ||
      (item.artist && item.artist.toLowerCase().includes(lowerQuery))
    );
  };

  const searchInUsers = (users: User[], query: string) => {
    if (!query.trim()) return users;
    const lowerQuery = query.toLowerCase();
    return users.filter(user =>
      user.displayName.toLowerCase().includes(lowerQuery) ||
      user.username.toLowerCase().includes(lowerQuery) ||
      (user.bio && user.bio.toLowerCase().includes(lowerQuery))
    );
  };

  const sortContent = (content: Content[]) => {
    const sorted = [...content].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
        case 'year':
          return sortOrder === 'desc' ? b.year - a.year : a.year - b.year;
        case 'popularity':
          return sortOrder === 'desc' ? b.stats.watched - a.stats.watched : a.stats.watched - b.stats.watched;
        default:
          return 0; // relevance - maintain search order
      }
    });
    return sorted;
  };

  // Get filtered results
  const getFilteredResults = () => {
    let filteredContent = searchInContent(content, searchQuery);
    let filteredUsers = searchInUsers(users, searchQuery);

    if (selectedTab !== 'all' && selectedTab !== 'users') {
      filteredContent = filteredContent.filter(item => item.type === selectedTab);
    }

    if (selectedTab === 'users') {
      return { content: [], users: filteredUsers };
    }

    if (selectedTab === 'all') {
      return { 
        content: sortContent(filteredContent), 
        users: filteredUsers 
      };
    }

    return { 
      content: sortContent(filteredContent), 
      users: [] 
    };
  };

  const { content: filteredContent, users: filteredUsers } = getFilteredResults();
  const totalResults = filteredContent.length + filteredUsers.length;

  // Infinite scroll handler
  const loadMore = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setDisplayedItems(prev => prev + 12);
      setIsLoading(false);
    }, 500);
  }, [isLoading]);

  // Scroll event listener for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  const displayedContent = filteredContent.slice(0, displayedItems);
  const displayedUsers = filteredUsers.slice(0, displayedItems);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search content, users, reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 text-lg h-12"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Results Summary */}
        {searchQuery && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">
                Found <span className="font-medium text-foreground">{totalResults}</span> results 
                for "<span className="font-medium text-foreground">{searchQuery}</span>"
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border rounded px-2 py-1 bg-background"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="year">Year</option>
                <option value="popularity">Popularity</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Content Tabs */}
      <SwipeableTabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        tabs={contentTypes.map((type) => ({
          value: type.id,
          label: type.label,
          icon: <type.icon className="w-4 h-4" />,
          content: type.id === 'all' ? (
            <div className="space-y-6">
              {/* Users Section */}
              {filteredUsers.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Users ({filteredUsers.length})
                  </h2>
                  <div className="grid gap-3">
                    {displayedUsers.slice(0, 3).map((user) => (
                      <Card key={user.id} className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => onUserClick?.(user.id)}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={user.avatar} alt={user.displayName} />
                              <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-medium">{user.displayName}</h3>
                              <p className="text-sm text-muted-foreground">@{user.username}</p>
                              {user.bio && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>
                              )}
                            </div>
                            <Badge variant="outline">
                              {user.followersCount.toLocaleString()} followers
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {filteredUsers.length > 3 && (
                      <Button variant="outline" onClick={() => setSelectedTab('users')}>
                        View all {filteredUsers.length} users
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Content Section */}
              {filteredContent.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl flex items-center gap-2">
                    <Grid className="w-5 h-5" />
                    Content ({filteredContent.length})
                  </h2>
                  <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {displayedContent.map((item) => (
                      <ContentCard
                        key={item.id}
                        content={item}
                        onCardClick={onContentClick}
                        compact={viewMode === 'list'}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : type.id === 'users' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                <h2 className="text-xl">Users ({filteredUsers.length})</h2>
              </div>
              <div className="grid gap-3">
                {displayedUsers.map((user) => (
                  <Card key={user.id} className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onUserClick?.(user.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} alt={user.displayName} />
                          <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{user.displayName}</h3>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                          {user.bio && (
                            <p className="text-xs text-muted-foreground mt-1">{user.bio}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">
                            {user.followersCount.toLocaleString()} followers
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {user.followingCount} following
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <type.icon className="w-5 h-5" />
                <h2 className="text-xl">{type.label} ({filteredContent.filter(c => c.type === type.id).length})</h2>
              </div>
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredContent
                  .filter(item => item.type === type.id)
                  .slice(0, displayedItems)
                  .map((item) => (
                    <ContentCard
                      key={item.id}
                      content={item}
                      onCardClick={onContentClick}
                      compact={viewMode === 'list'}
                    />
                  ))}
              </div>
            </div>
          )
        }))}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-2">Loading more results...</p>
        </div>
      )}

      {/* No results */}
      {searchQuery && totalResults === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl mb-2">No results found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search terms or explore different categories.
          </p>
        </div>
      )}
    </div>
  );
}