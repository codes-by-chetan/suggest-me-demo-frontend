import { useState } from "react";
import { Content, User, UserActivity } from "../types";
import { ActivityFeed } from "./ActivityFeed";
import { SwipeableTabs } from "./SwipeableTabs";
import {
  PageTransition,
  StaggerContainer,
  StaggerItem,
  SlideInCard,
  FadeIn,
} from "./PageTransition";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import {
  Users,
  UserPlus,
  MessageSquare,
  Heart,
  Star,
  TrendingUp,
  Activity,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";

interface SocialPageProps {
  content: Content[];
  users: User[];
  activities: UserActivity[];
  currentUserId: string;
  followedUsers: Set<string>;
  onFollowUser: (userId: string) => void;
}

export function SocialPage({
  content,
  users,
  activities,
  currentUserId,
  followedUsers,
  onFollowUser,
}: SocialPageProps) {
  const [selectedTab, setSelectedTab] = useState("feed");
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = users.find((u) => u.id === currentUserId);
  const followedUsersList = users.filter((u) =>
    followedUsers.has(u.id),
  );
  const suggestedUsers = users.filter(
    (u) => u.id !== currentUserId && !followedUsers.has(u.id),
  );

  // Mock social stats
  const socialStats = {
    followers: currentUser?.followersCount || 0,
    following: followedUsers.size,
    totalInteractions: 234,
    thisWeekActivity: 42,
  };

  // Mock friend activities - in real app, filter by followed users
  const friendActivities = activities.filter((activity) =>
    followedUsers.has(activity.userId),
  );

  const trendingUsers = [...users]
    .filter((u) => u.id !== currentUserId)
    .sort((a, b) => b.followersCount - a.followersCount)
    .slice(0, 5);

  const filteredUsers = users.filter(
    (user) =>
      user.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl"
              >
                Social
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm sm:text-base text-muted-foreground"
              >
                Connect with friends and discover new content
              </motion.p>
            </div>
            <motion.div
              className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.4,
                  type: "spring",
                  bounce: 0.6,
                }}
              >
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 text-xs"
                >
                  <Users className="w-3 h-3" />
                  <span>{followedUsers.size} following</span>
                  {/* <span className="xs:hidden">
                    {followedUsers.size}
                  </span> */}
                </Badge>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.5,
                  type: "spring",
                  bounce: 0.6,
                }}
              >
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 text-xs"
                >
                  <Heart className="w-3 h-3 text-red-500" />
                  <span>{socialStats.followers} followers</span>
                  {/* <span className="inline sm:hidden">
                    {socialStats.followers}
                  </span> */}
                </Badge>
              </motion.div>
            </motion.div>
          </div>
        </FadeIn>

        {/* Quick Stats */}
        <StaggerContainer
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          staggerChildren={0.1}
          delayChildren={0.5}
        >
          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <motion.div>
                    <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.7,
                      type: "spring",
                      bounce: 0.6,
                    }}
                    className="text-2xl"
                  >
                    {socialStats.followers}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Followers
                  </p>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <motion.div>
                    <UserPlus className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.8,
                      type: "spring",
                      bounce: 0.6,
                    }}
                    className="text-2xl"
                  >
                    {socialStats.following}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Following
                  </p>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <motion.div>
                    <MessageSquare className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.9,
                      type: "spring",
                      bounce: 0.6,
                    }}
                    className="text-2xl"
                  >
                    {socialStats.totalInteractions}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Interactions
                  </p>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <motion.div>
                    <Activity className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 1.0,
                      type: "spring",
                      bounce: 0.6,
                    }}
                    className="text-2xl"
                  >
                    {socialStats.thisWeekActivity}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    This Week
                  </p>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
        </StaggerContainer>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <SlideInCard
            direction="up"
            delay={0.8}
            className="lg:col-span-2"
          >
            <SwipeableTabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              tabs={[
                {
                  value: "feed",
                  label: "Feed",
                  icon: <Activity className="w-4 h-4" />,
                  content: (
                    <div className="space-y-4">
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div>
                          <Activity className="w-5 h-5" />
                        </motion.div>
                        <h2 className="text-xl">
                          Friend Activity
                        </h2>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.3,
                            type: "spring",
                            bounce: 0.6,
                          }}
                        >
                          <Badge variant="secondary">
                            {friendActivities.length} recent
                          </Badge>
                        </motion.div>
                      </motion.div>
                      <ActivityFeed
                        activities={friendActivities}
                        users={users}
                        content={content}
                      />
                    </div>
                  ),
                },
                {
                  value: "following",
                  label: "Following",
                  icon: <Users className="w-4 h-4" />,
                  content: (
                    <div className="space-y-4">
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div>
                          <Users className="w-5 h-5" />
                        </motion.div>
                        <h2 className="text-xl">
                          People You Follow
                        </h2>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.3,
                            type: "spring",
                            bounce: 0.6,
                          }}
                        >
                          <Badge variant="secondary">
                            {followedUsersList.length}
                          </Badge>
                        </motion.div>
                      </motion.div>
                      <StaggerContainer
                        className="grid gap-4"
                        staggerChildren={0.1}
                        delayChildren={0.4}
                      >
                        {followedUsersList.map(
                          (user, index) => (
                            <StaggerItem
                              key={user.id}
                              index={index}
                            >
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Card className="hover:shadow-md transition-shadow">
                                  <CardContent className="p-3 sm:p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <motion.div
                                          whileHover={{
                                            scale: 1.1,
                                          }}
                                        >
                                          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                            <AvatarImage
                                              src={user.avatar}
                                              alt={
                                                user.displayName
                                              }
                                            />
                                            <AvatarFallback>
                                              {user.displayName.charAt(
                                                0,
                                              )}
                                            </AvatarFallback>
                                          </Avatar>
                                        </motion.div>
                                        <div className="min-w-0 flex-1">
                                          <h3 className="font-medium truncate">
                                            {user.displayName}
                                          </h3>
                                          <p className="text-sm text-muted-foreground truncate">
                                            @{user.username}
                                          </p>
                                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-1">
                                            {user.bio}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
                                        <Badge
                                          variant="outline"
                                          className="text-xs px-2 py-1"
                                        >
                                          {user.followersCount.toLocaleString()}
                                        </Badge>
                                        <motion.div
                                          whileHover={{
                                            scale: 1.05,
                                          }}
                                          whileTap={{
                                            scale: 0.95,
                                          }}
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              onFollowUser(
                                                user.id,
                                              )
                                            }
                                            className="px-3"
                                          >
                                            Unfollow
                                          </Button>
                                        </motion.div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </StaggerItem>
                          ),
                        )}
                      </StaggerContainer>
                    </div>
                  ),
                },
                {
                  value: "discover",
                  label: "Discover",
                  icon: <Search className="w-4 h-4" />,
                  content: (
                    <div className="space-y-4">
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div>
                          <Search className="w-5 h-5" />
                        </motion.div>
                        <h2 className="text-xl">
                          Discover People
                        </h2>
                      </motion.div>

                      <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) =>
                            setSearchQuery(e.target.value)
                          }
                          className="pl-10"
                        />
                      </motion.div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={searchQuery}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <StaggerContainer
                            className="grid gap-4"
                            staggerChildren={0.05}
                            delayChildren={0.4}
                          >
                            {(searchQuery
                              ? filteredUsers
                              : suggestedUsers
                            ).map((user, index) => (
                              <StaggerItem
                                key={user.id}
                                index={index}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-3 sm:p-4">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                          <motion.div
                                            whileHover={{
                                              scale: 1.1,
                                            }}
                                          >
                                            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                              <AvatarImage
                                                src={
                                                  user.avatar
                                                }
                                                alt={
                                                  user.displayName
                                                }
                                              />
                                              <AvatarFallback>
                                                {user.displayName.charAt(
                                                  0,
                                                )}
                                              </AvatarFallback>
                                            </Avatar>
                                          </motion.div>
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <h3 className="font-medium truncate">
                                                {
                                                  user.displayName
                                                }
                                              </h3>
                                              <Badge
                                                variant="outline"
                                                className="text-xs px-2 py-1 hidden sm:inline-flex"
                                              >
                                                {user.followersCount.toLocaleString()}
                                              </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">
                                              @{user.username}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-1">
                                              {user.bio}
                                            </p>
                                            <Badge
                                              variant="outline"
                                              className="text-xs px-2 py-1 mt-2 inline-flex sm:hidden"
                                            >
                                              {user.followersCount.toLocaleString()}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-2 flex-shrink-0">
                                          <motion.div
                                            whileHover={{
                                              scale: 1.05,
                                            }}
                                            whileTap={{
                                              scale: 0.95,
                                            }}
                                          >
                                            <Button
                                              variant={
                                                followedUsers.has(
                                                  user.id,
                                                )
                                                  ? "outline"
                                                  : "default"
                                              }
                                              size="sm"
                                              onClick={() =>
                                                onFollowUser(
                                                  user.id,
                                                )
                                              }
                                              className="px-3"
                                            >
                                              {followedUsers.has(
                                                user.id,
                                              )
                                                ? "Unfollow"
                                                : "Follow"}
                                            </Button>
                                          </motion.div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              </StaggerItem>
                            ))}
                          </StaggerContainer>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  ),
                },
                {
                  value: "trending",
                  label: "Trending",
                  icon: <TrendingUp className="w-4 h-4" />,
                  content: (
                    <div className="space-y-4">
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div>
                          <TrendingUp className="w-5 h-5" />
                        </motion.div>
                        <h2 className="text-xl">
                          Trending Users
                        </h2>
                      </motion.div>
                      <StaggerContainer
                        className="grid gap-4"
                        staggerChildren={0.1}
                        delayChildren={0.3}
                      >
                        {trendingUsers.map((user, index) => (
                          <StaggerItem
                            key={user.id}
                            index={index}
                          >
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-3 sm:p-4">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                          delay:
                                            0.5 + index * 0.1,
                                          type: "spring",
                                          bounce: 0.6,
                                        }}
                                      >
                                        <Badge
                                          variant="outline"
                                          className="w-6 h-6 sm:w-8 sm:h-8 p-0 flex items-center justify-center text-xs flex-shrink-0"
                                        >
                                          #{index + 1}
                                        </Badge>
                                      </motion.div>
                                      <motion.div
                                        whileHover={{
                                          scale: 1.1,
                                        }}
                                      >
                                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                          <AvatarImage
                                            src={user.avatar}
                                            alt={
                                              user.displayName
                                            }
                                          />
                                          <AvatarFallback>
                                            {user.displayName.charAt(
                                              0,
                                            )}
                                          </AvatarFallback>
                                        </Avatar>
                                      </motion.div>
                                      <div className="min-w-0 flex-1">
                                        <h3 className="font-medium truncate">
                                          {user.displayName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground truncate">
                                          @{user.username}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <motion.div
                                            animate={{
                                              scale: [
                                                1, 1.2, 1,
                                              ],
                                            }}
                                            transition={{
                                              duration: 2,
                                              repeat: Infinity,
                                            }}
                                          >
                                            <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                          </motion.div>
                                          <span className="text-xs text-muted-foreground truncate">
                                            {user.followersCount.toLocaleString()}{" "}
                                            followers
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 flex-shrink-0">
                                      <motion.div
                                        whileHover={{
                                          scale: 1.05,
                                        }}
                                        whileTap={{
                                          scale: 0.95,
                                        }}
                                      >
                                        <Button
                                          variant={
                                            followedUsers.has(
                                              user.id,
                                            )
                                              ? "outline"
                                              : "default"
                                          }
                                          size="sm"
                                          onClick={() =>
                                            onFollowUser(
                                              user.id,
                                            )
                                          }
                                          className="px-3"
                                        >
                                          {followedUsers.has(
                                            user.id,
                                          )
                                            ? "Following"
                                            : "Follow"}
                                        </Button>
                                      </motion.div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    </div>
                  ),
                },
              ]}
            />
          </SlideInCard>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Suggestions */}
            <SlideInCard direction="right" delay={0.9}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Suggested for You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StaggerContainer
                    className="space-y-3"
                    staggerChildren={0.1}
                    delayChildren={1.0}
                  >
                    {suggestedUsers
                      .slice(0, 3)
                      .map((user, index) => (
                        <StaggerItem
                          key={user.id}
                          index={index}
                        >
                          <motion.div
                            className="flex items-center gap-3"
                            whileHover={{ scale: 1.02, x: 5 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                            }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={user.avatar}
                                  alt={user.displayName}
                                />
                                <AvatarFallback>
                                  {user.displayName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {user.displayName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                @{user.username}
                              </p>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  onFollowUser(user.id)
                                }
                              >
                                Follow
                              </Button>
                            </motion.div>
                          </motion.div>
                        </StaggerItem>
                      ))}
                  </StaggerContainer>
                </CardContent>
              </Card>
            </SlideInCard>

            {/* Activity Summary */}
            <SlideInCard direction="right" delay={1.1}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StaggerContainer
                    className="space-y-3"
                    staggerChildren={0.1}
                    delayChildren={1.2}
                  >
                    <StaggerItem>
                      <motion.div
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          >
                            <Activity className="w-4 h-4 text-blue-500" />
                          </motion.div>
                          <span className="text-sm">
                            Activities
                          </span>
                        </div>
                        <Badge variant="secondary">12</Badge>
                      </motion.div>
                    </StaggerItem>
                    <StaggerItem>
                      <motion.div
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                          >
                            <Heart className="w-4 h-4 text-red-500" />
                          </motion.div>
                          <span className="text-sm">
                            Likes Given
                          </span>
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
                          <motion.div
                            animate={{ x: [0, 2, -2, 0] }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                            }}
                          >
                            <MessageSquare className="w-4 h-4 text-green-500" />
                          </motion.div>
                          <span className="text-sm">
                            Comments
                          </span>
                        </div>
                        <Badge variant="secondary">15</Badge>
                      </motion.div>
                    </StaggerItem>
                  </StaggerContainer>
                </CardContent>
              </Card>
            </SlideInCard>

            {/* Quick Actions */}
            <SlideInCard direction="right" delay={1.3}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <StaggerContainer
                    staggerChildren={0.1}
                    delayChildren={1.4}
                  >
                    <StaggerItem>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Find Friends
                        </Button>
                      </motion.div>
                    </StaggerItem>
                    <StaggerItem>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </motion.div>
                    </StaggerItem>
                    <StaggerItem>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          Filter Feed
                        </Button>
                      </motion.div>
                    </StaggerItem>
                  </StaggerContainer>
                </CardContent>
              </Card>
            </SlideInCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}