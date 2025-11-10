import { useState, useEffect } from 'react';
import { Content, User } from './types';
import { mockUsers, mockContent, mockReviews, mockActivities, mockRecommendations } from './data/mockData';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationsProvider, useNotifications } from './contexts/NotificationsContext';
import { ProfileDropdownProvider } from './contexts/ProfileDropdownContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { GlobalPopups } from './components/GlobalPopups';
import { ContentCard } from './components/ContentCard';
import { ContentDetails } from './components/ContentDetails';
import { ActivityFeed } from './components/ActivityFeed';
import { RecommendationsFeed } from './components/RecommendationsFeed';
import { RecommendationsManager } from './components/RecommendationsManager';
import { DiscoverPage } from './components/DiscoverPage';
import { LibraryPage } from './components/LibraryPage';
import { SocialPage } from './components/SocialPage';
import { SearchPage } from './components/SearchPage';
import { NotificationsPage } from './components/NotificationsPage';
import { ChatPage } from './components/ChatPage';
import { ProfilePage } from './components/ProfilePage';
import { UserProfilePage } from './components/UserProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { SwipeableTabs } from './components/SwipeableTabs';
import { PageTransition, StaggerContainer, StaggerItem, SlideInCard, FadeIn } from './components/PageTransition';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { TrendingUp, Star, Users, Clock, Plus, Heart, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [previousPage, setPreviousPage] = useState('home');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set(['2', '3']));
  const [favoriteContent, setFavoriteContent] = useState<Set<string>>(new Set(['1', '2', '3', '4']));
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  // Mock current user (in a real app, this would come from authentication)
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  
  // Get notifications context
  const { openNotifications } = useNotifications();

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
    setCurrentPage('content-details');
  };

  const handleNavigation = (page: string, query?: string) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
    if (query !== undefined) {
      setSearchQuery(query);
    }
    if (page !== 'content-details') {
      setSelectedContent(null);
    }
    if (page !== 'user-profile') {
      setSelectedUserId(null);
    }
  };

  const handleBackNavigation = () => {
    handleNavigation(previousPage);
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentPage('user-profile');
  };

  const handleFollowUser = (userId: string) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleToggleFavorite = (contentId: string) => {
    setFavoriteContent(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contentId)) {
        newSet.delete(contentId);
      } else {
        newSet.add(contentId);
      }
      return newSet;
    });
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle notification click from profile dropdown
  const handleNotificationClick = () => {
    if (isMobile) {
      handleNavigation('notifications');
    } else {
      openNotifications();
    }
  };

  // Page transition wrapper
  const PageWrapper = ({ children }: { children: React.ReactNode }) => {
    // On mobile chat page, use full screen (no padding for nav bars)
    const isFullScreenMobile = isMobile && currentPage === 'chat';
    
    return (
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`min-h-screen bg-background ${isFullScreenMobile ? '' : 'pb-16 md:pb-0'}`}
      >
        {children}
      </motion.div>
    );
  };

  // Check if we should hide nav bars on mobile
  const shouldHideNavBars = isMobile && currentPage === 'chat';

  // Content Details View
  if (currentPage === 'content-details' && selectedContent) {
    return (
      <AnimatePresence mode="wait">
        <PageWrapper>
          <Header 
            currentUser={currentUser}
            onNavigate={handleNavigation}
            currentPage={currentPage}
            users={mockUsers}
            content={mockContent}
          />
          <GlobalPopups
            currentUser={currentUser}
            users={mockUsers}
            content={mockContent}
            isMobile={isMobile}
            onNavigate={handleNavigation}
            onNotificationClick={handleNotificationClick}
          />
          <ContentDetails
            content={selectedContent}
            reviews={mockReviews}
            users={mockUsers}
            currentUserId={currentUser.id}
            onBack={() => handleNavigation('home')}
          />
          <MobileBottomNav 
            currentPage={currentPage}
            onNavigate={handleNavigation}
            notificationCount={3}
            messageCount={7}
          />
        </PageWrapper>
      </AnimatePresence>
    );
  }

  // User Profile View
  if (currentPage === 'user-profile' && selectedUserId) {
    return (
      <AnimatePresence mode="wait">
        <PageWrapper>
          <Header 
            currentUser={currentUser}
            onNavigate={handleNavigation}
            currentPage={currentPage}
            users={mockUsers}
            content={mockContent}
          />
          <GlobalPopups
            currentUser={currentUser}
            users={mockUsers}
            content={mockContent}
            isMobile={isMobile}
            onNavigate={handleNavigation}
            onNotificationClick={handleNotificationClick}
          />
          <UserProfilePage
            users={mockUsers}
            content={mockContent}
            reviews={mockReviews}
            currentUserId={currentUser.id}
            profileUserId={selectedUserId}
            followedUsers={followedUsers}
            onContentClick={handleContentClick}
            onFollowUser={handleFollowUser}
            onBack={() => handleNavigation('home')}
          />
          <MobileBottomNav 
            currentPage={currentPage}
            onNavigate={handleNavigation}
            notificationCount={3}
            messageCount={7}
          />
        </PageWrapper>
      </AnimatePresence>
    );
  }

  // Discover Page
  if (currentPage === 'discover') {
    return (
      <AnimatePresence mode="wait">
        <PageWrapper>
          <Header 
            currentUser={currentUser}
            onNavigate={handleNavigation}
            currentPage={currentPage}
            users={mockUsers}
            content={mockContent}
          />
          <GlobalPopups
            currentUser={currentUser}
            users={mockUsers}
            content={mockContent}
            isMobile={isMobile}
            onNavigate={handleNavigation}
            onNotificationClick={handleNotificationClick}
          />
          <DiscoverPage
            content={mockContent}
            users={mockUsers}
            onContentClick={handleContentClick}
          />
          <MobileBottomNav 
            currentPage={currentPage}
            onNavigate={handleNavigation}
            notificationCount={3}
            messageCount={7}
          />
        </PageWrapper>
      </AnimatePresence>
    );
  }

  // Library Page
  if (currentPage === 'library') {
    return (
      <AnimatePresence mode="wait">
        <PageWrapper>
          <Header 
            currentUser={currentUser}
            onNavigate={handleNavigation}
            currentPage={currentPage}
            users={mockUsers}
            content={mockContent}
          />
          <GlobalPopups
            currentUser={currentUser}
            users={mockUsers}
            content={mockContent}
            isMobile={isMobile}
            onNavigate={handleNavigation}
            onNotificationClick={handleNotificationClick}
          />
          <LibraryPage
            content={mockContent}
            users={mockUsers}
            currentUserId={currentUser.id}
            onContentClick={handleContentClick}
          />
          <MobileBottomNav 
            currentPage={currentPage}
            onNavigate={handleNavigation}
            notificationCount={3}
            messageCount={7}
          />
        </PageWrapper>
      </AnimatePresence>
    );
  }

  // Social Page
  if (currentPage === 'social') {
    return (
      <AnimatePresence mode="wait">
        <PageWrapper>
          <Header 
            currentUser={currentUser}
            onNavigate={handleNavigation}
            currentPage={currentPage}
            users={mockUsers}
            content={mockContent}
          />
          <GlobalPopups
            currentUser={currentUser}
            users={mockUsers}
            content={mockContent}
            isMobile={isMobile}
            onNavigate={handleNavigation}
            onNotificationClick={handleNotificationClick}
          />
          <SocialPage
            content={mockContent}
            users={mockUsers}
            activities={mockActivities}
            currentUserId={currentUser.id}
            followedUsers={followedUsers}
            onFollowUser={handleFollowUser}
          />
          <MobileBottomNav 
            currentPage={currentPage}
            onNavigate={handleNavigation}
            notificationCount={3}
            messageCount={7}
          />
        </PageWrapper>
      </AnimatePresence>
    );
  }

  // Search Page
  if (currentPage === 'search') {
    return (
      <AnimatePresence mode="wait">
        <PageWrapper>
          <Header 
            currentUser={currentUser}
            onNavigate={handleNavigation}
            currentPage={currentPage}
            users={mockUsers}
            content={mockContent}
          />
          <GlobalPopups
            currentUser={currentUser}
            users={mockUsers}
            content={mockContent}
            isMobile={isMobile}
            onNavigate={handleNavigation}
            onNotificationClick={handleNotificationClick}
          />
          <SearchPage
            content={mockContent}
            users={mockUsers}
            onContentClick={handleContentClick}
            onUserClick={handleUserClick}
            initialQuery={searchQuery}
          />
          <MobileBottomNav 
            currentPage={currentPage}
            onNavigate={handleNavigation}
            notificationCount={3}
            messageCount={7}
          />
        </PageWrapper>
      </AnimatePresence>
    );
  }

  // Notifications Page
  if (currentPage === 'notifications') {
    return (
      <AnimatePresence mode="wait">
        <PageWrapper>
          <Header 
            currentUser={currentUser}
            onNavigate={handleNavigation}
            currentPage={currentPage}
            users={mockUsers}
            content={mockContent}
          />
          <GlobalPopups
            currentUser={currentUser}
            users={mockUsers}
            content={mockContent}
            isMobile={isMobile}
            onNavigate={handleNavigation}
            onNotificationClick={handleNotificationClick}
          />
          <NotificationsPage
            users={mockUsers}
            content={mockContent}
            currentUserId={currentUser.id}
          />
          <MobileBottomNav 
            currentPage={currentPage}
            onNavigate={handleNavigation}
            notificationCount={3}
            messageCount={7}
          />
        </PageWrapper>
      </AnimatePresence>
    );
  }

  // Chat Page
  if (currentPage === 'chat') {
    return (
      <AnimatePresence mode="wait">
        <PageWrapper>
          {!shouldHideNavBars && (
            <Header 
              currentUser={currentUser}
              onNavigate={handleNavigation}
              currentPage={currentPage}
              users={mockUsers}
              content={mockContent}
            />
          )}
          <GlobalPopups
            currentUser={currentUser}
            users={mockUsers}
            content={mockContent}
            isMobile={isMobile}
            onNavigate={handleNavigation}
            onNotificationClick={handleNotificationClick}
          />
          <ChatPage
            users={mockUsers}
            currentUserId={currentUser.id}
            onBack={handleBackNavigation}
            isMobileFullScreen={shouldHideNavBars}
          />
          {!shouldHideNavBars && (
            <MobileBottomNav 
              currentPage={currentPage}
              onNavigate={handleNavigation}
              notificationCount={3}
              messageCount={7}
            />
          )}
        </PageWrapper>
      </AnimatePresence>
    );
  }

  // Profile Page
  if (currentPage === 'profile') {
    return (
      <AnimatePresence mode="wait">
        <PageWrapper>
          <Header 
            currentUser={currentUser}
            onNavigate={handleNavigation}
            currentPage={currentPage}
            users={mockUsers}
            content={mockContent}
          />
          <GlobalPopups
            currentUser={currentUser}
            users={mockUsers}
            content={mockContent}
            isMobile={isMobile}
            onNavigate={handleNavigation}
            onNotificationClick={handleNotificationClick}
          />
          <ProfilePage
            users={mockUsers}
            content={mockContent}
            reviews={mockReviews}
            currentUserId={currentUser.id}
            isOwnProfile={true}
            onContentClick={handleContentClick}
            favoriteContentIds={favoriteContent}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToSettings={() => handleNavigation('settings')}
          />
          <MobileBottomNav 
            currentPage={currentPage}
            onNavigate={handleNavigation}
            notificationCount={3}
            messageCount={7}
          />
        </PageWrapper>
      </AnimatePresence>
    );
  }

  // Settings Page
  if (currentPage === 'settings') {
    return (
      <AnimatePresence mode="wait">
        <PageWrapper>
          <SettingsPage
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onBack={() => handleNavigation('profile')}
          />
          <MobileBottomNav 
            currentPage={currentPage}
            onNavigate={handleNavigation}
            notificationCount={3}
            messageCount={7}
          />
        </PageWrapper>
      </AnimatePresence>
    );
  }

  // Recommendations Manager View
  if (currentPage === 'recommendations') {
    return (
      <AnimatePresence mode="wait">
        <PageWrapper>
          <Header 
            currentUser={currentUser}
            onNavigate={handleNavigation}
            currentPage={currentPage}
            users={mockUsers}
            content={mockContent}
          />
          <GlobalPopups
            currentUser={currentUser}
            users={mockUsers}
            content={mockContent}
            isMobile={isMobile}
            onNavigate={handleNavigation}
            onNotificationClick={handleNotificationClick}
          />
          <RecommendationsManager
            recommendations={mockRecommendations}
            users={mockUsers}
            content={mockContent}
            currentUserId={currentUser.id}
            onContentClick={handleContentClick}
          />
          <MobileBottomNav 
            currentPage={currentPage}
            onNavigate={handleNavigation}
            notificationCount={3}
            messageCount={7}
          />
        </PageWrapper>
      </AnimatePresence>
    );
  }

  // Home/Main View
  return (
    <AnimatePresence mode="wait">
      <PageWrapper>
        <Header 
          currentUser={currentUser}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          users={mockUsers}
          content={mockContent}
        />
        
        <GlobalPopups
          currentUser={currentUser}
          users={mockUsers}
          content={mockContent}
          isMobile={isMobile}
          onNavigate={handleNavigation}
          onNotificationClick={handleNotificationClick}
        />
        
        <PageTransition>
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Welcome Section */}
                <SlideInCard direction="up" delay={0.1}>
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <motion.span
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          Welcome back, {currentUser.displayName}!
                        </motion.span>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring", bounce: 0.6 }}
                        >
                          <Badge variant="secondary" className="w-fit">
                            {currentUser.followersCount.toLocaleString()} followers
                          </Badge>
                        </motion.div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FadeIn delay={0.3}>
                        <p className="text-muted-foreground mb-4">
                          Discover new content, see what your friends are watching, and share your thoughts.
                        </p>
                      </FadeIn>
                      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4" staggerChildren={0.1} delayChildren={0.4}>
                        <StaggerItem>
                          <motion.div 
                            className="text-center cursor-pointer hover:scale-105 transition-transform p-2 rounded-lg hover:bg-muted/50"
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-2xl mb-1">📚</div>
                            <p className="text-sm">Discover Books</p>
                          </motion.div>
                        </StaggerItem>
                        <StaggerItem>
                          <motion.div 
                            className="text-center cursor-pointer hover:scale-105 transition-transform p-2 rounded-lg hover:bg-muted/50"
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-2xl mb-1">🎬</div>
                            <p className="text-sm">Watch Movies</p>
                          </motion.div>
                        </StaggerItem>
                        <StaggerItem>
                          <motion.div 
                            className="text-center cursor-pointer hover:scale-105 transition-transform p-2 rounded-lg hover:bg-muted/50"
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-2xl mb-1">📺</div>
                            <p className="text-sm">Binge Series</p>
                          </motion.div>
                        </StaggerItem>
                        <StaggerItem>
                          <motion.div 
                            className="text-center cursor-pointer hover:scale-105 transition-transform p-2 rounded-lg hover:bg-muted/50"
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-2xl mb-1">🎵</div>
                            <p className="text-sm">Listen Music</p>
                          </motion.div>
                        </StaggerItem>
                      </StaggerContainer>
                    </CardContent>
                  </Card>
                </SlideInCard>

                {/* Main Feed Tabs */}
                <SlideInCard direction="up" delay={0.3}>
                  <SwipeableTabs
                    defaultValue="recommendations"
                    tabs={[
                      {
                        value: "recommendations",
                        label: "Recommendations",
                        icon: <Heart className="w-4 h-4" />,
                        content: (
                          <RecommendationsFeed
                            recommendations={mockRecommendations}
                            users={mockUsers}
                            content={mockContent}
                            currentUserId={currentUser.id}
                            onContentClick={handleContentClick}
                          />
                        )
                      },
                      {
                        value: "trending",
                        label: "Trending",
                        icon: <TrendingUp className="w-4 h-4" />,
                        content: (
                          <div className="space-y-4">
                            {/* <motion.div 
                              className="flex items-center gap-2"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <TrendingUp className="w-5 h-5" />
                              <h2 className="text-xl">Trending Content</h2>
                            </motion.div> */}
                            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" staggerChildren={0.1}>
                              {mockContent
                                .sort((a, b) => b.stats.watched - a.stats.watched)
                                .map((content, index) => (
                                  <StaggerItem key={content.id} index={index}>
                                    <ContentCard
                                      content={content}
                                      onCardClick={handleContentClick}
                                      compact
                                    />
                                  </StaggerItem>
                                ))}
                            </StaggerContainer>
                          </div>
                        )
                      },
                      {
                        value: "activity",
                        label: "Activity",
                        icon: <Activity className="w-4 h-4" />,
                        content: (
                          <ActivityFeed
                            activities={mockActivities}
                            users={mockUsers}
                            content={mockContent}
                          />
                        )
                      }
                    ]}
                  />
                </SlideInCard>
              </div>

              {/* Sidebar - Hidden on mobile, shown on larger screens */}
              <div className="hidden lg:block space-y-6">
                {/* Quick Stats */}
                <SlideInCard direction="right" delay={0.4}>
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg">Your Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <StaggerContainer staggerChildren={0.1} delayChildren={0.5}>
                        <StaggerItem>
                          <motion.div 
                            className="flex items-center justify-between p-2  rounded-lg hover:bg-muted/50 transition-colors"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">Reviews Written</span>
                            </div>
                            <Badge variant="secondary">47</Badge>
                          </motion.div>
                        </StaggerItem>
                        <StaggerItem>
                          <motion.div 
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">Currently Watching</span>
                            </div>
                            <Badge variant="secondary">8</Badge>
                          </motion.div>
                        </StaggerItem>
                        <StaggerItem>
                          <motion.div 
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-green-500" />
                              <span className="text-sm">Recommendations</span>
                            </div>
                            <Badge variant="secondary">23</Badge>
                          </motion.div>
                        </StaggerItem>
                      </StaggerContainer>
                    </CardContent>
                  </Card>
                </SlideInCard>

                {/* Popular This Week */}
                {/* <SlideInCard direction="right" delay={0.5}>
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg">Popular This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StaggerContainer className="space-y-3" staggerChildren={0.05} delayChildren={0.6}>
                        {mockContent.slice(0, 3).map((content, index) => (
                          <StaggerItem key={content.id} index={index}>
                            <motion.div 
                              className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                              onClick={() => handleContentClick(content)}
                              whileHover={{ scale: 1.02, x: 5 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                                {index + 1}
                              </Badge>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{content.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {content.stats.watched.toLocaleString()} watched
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{content.rating}</span>
                              </div>
                            </motion.div>
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                      <FadeIn delay={0.8}>
                        <Button variant="outline" className="w-full mt-4 hover:scale-105 transition-transform" size="sm">
                          View All Popular
                        </Button>
                      </FadeIn>
                    </CardContent>
                  </Card>
                </SlideInCard> */}

                {/* Friend Suggestions */}
                <SlideInCard direction="right" delay={0.6}>
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg">Connect with Friends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StaggerContainer className="space-y-3" staggerChildren={0.05} delayChildren={0.7}>
                        {mockUsers.slice(1).map((user, index) => (
                          <StaggerItem key={user.id} index={index}>
                            <motion.div 
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                              whileHover={{ scale: 1.02 }}
                            >
                              <motion.img 
                                src={user.avatar} 
                                alt={user.displayName}
                                className="w-8 h-8 rounded-full object-cover"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              />
                              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleUserClick(user.id)}>
                                <p className="text-sm truncate hover:text-primary transition-colors">{user.displayName}</p>
                                <p className="text-xs text-muted-foreground">@{user.username}</p>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleFollowUser(user.id)}
                                className="hover:scale-105 transition-transform"
                              >
                                {followedUsers.has(user.id) ? 'Following' : 'Follow'}
                              </Button>
                            </motion.div>
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    </CardContent>
                  </Card>
                </SlideInCard>
              </div>
            </div>
          </div>
        </PageTransition>
        
        <MobileBottomNav 
          currentPage={currentPage}
          onNavigate={handleNavigation}
          notificationCount={3}
          messageCount={7}
        />
      </PageWrapper>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <ProfileDropdownProvider>
          <AppContent />
          <Toaster />
        </ProfileDropdownProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
}