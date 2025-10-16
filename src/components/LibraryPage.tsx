import { useState } from "react";
import { Content, User } from "../types";
import { ContentCard } from "./ContentCard";
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
import { Progress } from "./ui/progress";
import {
  BookOpen,
  Eye,
  Clock,
  Heart,
  Star,
  Calendar,
  BarChart3,
  TrendingUp,
  Check,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LibraryPageProps {
  content: Content[];
  users: User[];
  currentUserId: string;
  onContentClick: (content: Content) => void;
}

export function LibraryPage({
  content,
  users,
  currentUserId,
  onContentClick,
}: LibraryPageProps) {
  const [selectedTab, setSelectedTab] = useState("watching");

  // Mock user library data - in a real app, this would come from user's actual data
  const watchedContent = content.slice(0, 2);
  const watchingContent = content.slice(2, 4);
  const watchlistContent = content.slice(1, 4);
  const favoriteContent = content.slice(0, 3);
  const ratedContent = content.slice(0, 4);

  const currentUser = users.find((u) => u.id === currentUserId);

  const stats = {
    totalWatched: watchedContent.length,
    currentlyWatching: watchingContent.length,
    watchlistItems: watchlistContent.length,
    avgRating: 4.2,
    totalHours: 156,
    reviewsWritten: 47,
  };

  const recentActivity = [
    {
      type: "watched",
      content: content[0],
      date: "2 days ago",
    },
    {
      type: "rated",
      content: content[1],
      date: "3 days ago",
      rating: 5,
    },
    { type: "added", content: content[2], date: "1 week ago" },
  ];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <FadeIn delay={0.1}>
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl"
              >
                My Library
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground"
              >
                Track your entertainment journey
              </motion.p>
            </div>
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.img
                src={currentUser?.avatar}
                alt={currentUser?.displayName}
                className="w-10 h-10 rounded-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
              <div>
                <p className="text-sm">
                  {currentUser?.displayName}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{currentUser?.username}
                </p>
              </div>
            </motion.div>
          </div>
        </FadeIn>

        {/* Stats Overview */}
        <StaggerContainer
          className="grid grid-cols-2 md:grid-cols-6 gap-4"
          staggerChildren={0.1}
          delayChildren={0.4}
        >
          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <motion.div>
                    <Eye className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.6,
                      type: "spring",
                      bounce: 0.6,
                    }}
                    className="text-2xl"
                  >
                    {stats.totalWatched}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Watched
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
                    <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
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
                    {stats.currentlyWatching}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Watching
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
                    <BookOpen className="w-6 h-6 mx-auto mb-2 text-purple-500" />
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
                    {stats.watchlistItems}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Watchlist
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
                    <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
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
                    {stats.avgRating}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Avg Rating
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
                    <BarChart3 className="w-6 h-6 mx-auto mb-2 text-orange-500" />
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
                    {stats.totalHours}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Hours
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
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-red-500" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 1.1,
                      type: "spring",
                      bounce: 0.6,
                    }}
                    className="text-2xl"
                  >
                    {stats.reviewsWritten}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Reviews
                  </p>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
        </StaggerContainer>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Library Content */}
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
                  value: "watching",
                  label: "Watching",
                  icon: <Clock className="w-4 h-4" />,
                  content: (
                    <div className="space-y-4">
                      <motion.div
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Clock className="w-5 h-5 text-blue-500" />
                          </motion.div>
                          <h2 className="text-xl">
                            Currently Watching
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
                              {watchingContent.length}
                            </Badge>
                          </motion.div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Content
                          </Button>
                        </motion.div>
                      </motion.div>

                      <StaggerContainer
                        className="grid gap-4"
                        staggerChildren={0.1}
                        delayChildren={0.4}
                      >
                        {watchingContent.map((item, index) => (
                          <StaggerItem
                            key={item.id}
                            index={index}
                          >
                            <div className="relative">
                              <ContentCard
                                content={item}
                                onCardClick={onContentClick}
                                compact={true}
                              />
                              <motion.div
                                className="mt-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay: 0.6 + index * 0.1,
                                }}
                              >
                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                                  <span>Progress</span>
                                  <span>65%</span>
                                </div>
                                <motion.div
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  transition={{
                                    delay: 0.7 + index * 0.1,
                                    duration: 0.6,
                                  }}
                                  style={{
                                    transformOrigin: "left",
                                  }}
                                >
                                  <Progress
                                    value={65}
                                    className="h-2"
                                  />
                                </motion.div>
                              </motion.div>
                            </div>
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    </div>
                  ),
                },
                {
                  value: "watched",
                  label: "Watched",
                  icon: <Check className="w-4 h-4" />,
                  content: (
                    <div className="space-y-4">
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          <Check className="w-5 h-5 text-green-500" />
                        </motion.div>
                        <h2 className="text-xl">Watched</h2>
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
                            {watchedContent.length}
                          </Badge>
                        </motion.div>
                      </motion.div>
                      <StaggerContainer
                        className="grid gap-4"
                        staggerChildren={0.1}
                        delayChildren={0.4}
                      >
                        {watchedContent.map((item, index) => (
                          <StaggerItem
                            key={item.id}
                            index={index}
                          >
                            <ContentCard
                              content={item}
                              onCardClick={onContentClick}
                              compact={true}
                            />
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    </div>
                  ),
                },
                {
                  value: "watchlist",
                  label: "Watchlist",
                  icon: <BookOpen className="w-4 h-4" />,
                  content: (
                    <div className="space-y-4">
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        >
                          <BookOpen className="w-5 h-5 text-purple-500" />
                        </motion.div>
                        <h2 className="text-xl">Watchlist</h2>
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
                            {watchlistContent.length}
                          </Badge>
                        </motion.div>
                      </motion.div>
                      <StaggerContainer
                        className="grid gap-4"
                        staggerChildren={0.1}
                        delayChildren={0.4}
                      >
                        {watchlistContent.map((item, index) => (
                          <StaggerItem
                            key={item.id}
                            index={index}
                          >
                            <ContentCard
                              content={item}
                              onCardClick={onContentClick}
                              compact={true}
                            />
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    </div>
                  ),
                },
                {
                  value: "favorites",
                  label: "Favorites",
                  icon: <Heart className="w-4 h-4" />,
                  content: (
                    <div className="space-y-4">
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        >
                          <Heart className="w-5 h-5 text-red-500" />
                        </motion.div>
                        <h2 className="text-xl">Favorites</h2>
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
                            {favoriteContent.length}
                          </Badge>
                        </motion.div>
                      </motion.div>
                      <StaggerContainer
                        className="grid gap-4"
                        staggerChildren={0.1}
                        delayChildren={0.4}
                      >
                        {favoriteContent.map((item, index) => (
                          <StaggerItem
                            key={item.id}
                            index={index}
                          >
                            <ContentCard
                              content={item}
                              onCardClick={onContentClick}
                              compact={true}
                            />
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    </div>
                  ),
                },
                {
                  value: "rated",
                  label: "Rated",
                  icon: <Star className="w-4 h-4" />,
                  content: (
                    <div className="space-y-4">
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          <Star className="w-5 h-5 text-yellow-500" />
                        </motion.div>
                        <h2 className="text-xl">
                          Rated Content
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
                            {ratedContent.length}
                          </Badge>
                        </motion.div>
                      </motion.div>
                      <StaggerContainer
                        className="grid gap-4"
                        staggerChildren={0.1}
                        delayChildren={0.4}
                      >
                        {ratedContent.map((item, index) => (
                          <StaggerItem
                            key={item.id}
                            index={index}
                          >
                            <ContentCard
                              content={item}
                              onCardClick={onContentClick}
                              compact={true}
                            />
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
            {/* Recent Activity */}
            <SlideInCard direction="right" delay={0.9}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StaggerContainer
                    className="space-y-3"
                    staggerChildren={0.1}
                    delayChildren={1.0}
                  >
                    {recentActivity.map((activity, index) => (
                      <StaggerItem key={index} index={index}>
                        <motion.div
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                          whileHover={{ scale: 1.02, x: 5 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                          }}
                        >
                          <motion.div
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.2,
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              {activity.type === "watched" &&
                                "Watched"}
                              {activity.type === "rated" &&
                                `Rated ${activity.rating}/5`}
                              {activity.type === "added" &&
                                "Added to watchlist"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {activity.content.title}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {activity.date}
                          </span>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </CardContent>
              </Card>
            </SlideInCard>

            {/* Monthly Goal */}
            <SlideInCard direction="right" delay={1.1}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Monthly Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                    >
                      <span className="text-sm">
                        Watch 10 items
                      </span>
                      <span className="text-sm text-muted-foreground">
                        7/10
                      </span>
                    </motion.div>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.4, duration: 0.8 }}
                      style={{ transformOrigin: "left" }}
                    >
                      <Progress value={70} />
                    </motion.div>
                    <motion.p
                      className="text-xs text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6 }}
                    >
                      3 more to reach your goal!
                    </motion.p>
                  </div>
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
                    delayChildren={1.5}
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
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Watchlist
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
                          <Star className="w-4 h-4 mr-2" />
                          Rate Content
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
                          <Calendar className="w-4 h-4 mr-2" />
                          View Calendar
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