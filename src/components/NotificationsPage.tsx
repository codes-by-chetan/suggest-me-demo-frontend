import { useState } from "react";
import { User, Content } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import {
  Bell,
  Heart,
  MessageSquare,
  UserPlus,
  Star,
  Share,
  Play,
  Check,
  X,
  Settings,
  Filter,
  CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  PageTransition,
  StaggerContainer,
  StaggerItem,
  SlideInCard,
  FadeIn,
} from "./PageTransition";

interface NotificationsPageProps {
  users: User[];
  content: Content[];
  currentUserId: string;
}

interface Notification {
  id: string;
  type:
    | "like"
    | "comment"
    | "follow"
    | "recommendation"
    | "review"
    | "mention";
  userId: string;
  contentId?: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
}

export function NotificationsPage({
  users,
  content,
  currentUserId,
}: NotificationsPageProps) {
  const [selectedTab, setSelectedTab] = useState("all");
  const [filter, setFilter] = useState<
    "all" | "unread" | "today"
  >("all");
  const [isMarkingAllRead, setIsMarkingAllRead] =
    useState(false);

  // Mock notifications data
  const [notifications, setNotifications] = useState<
    Notification[]
  >([
    {
      id: "1",
      type: "like",
      userId: "2",
      contentId: "1",
      message: "liked your review of Dune: Part Two",
      timestamp: "2024-03-15T10:30:00Z",
      read: false,
    },
    {
      id: "2",
      type: "follow",
      userId: "3",
      message: "started following you",
      timestamp: "2024-03-15T09:15:00Z",
      read: false,
    },
    {
      id: "3",
      type: "recommendation",
      userId: "2",
      contentId: "3",
      message: "recommended Stranger Things to you",
      timestamp: "2024-03-14T18:45:00Z",
      read: true,
      actionRequired: true,
    },
    {
      id: "4",
      type: "comment",
      userId: "3",
      contentId: "1",
      message: "commented on your review of Dune: Part Two",
      timestamp: "2024-03-14T16:20:00Z",
      read: true,
    },
    {
      id: "5",
      type: "review",
      userId: "1",
      contentId: "4",
      message: "reviewed Interstellar soundtrack",
      timestamp: "2024-03-14T14:30:00Z",
      read: true,
    },
    {
      id: "6",
      type: "mention",
      userId: "2",
      message: "mentioned you in a comment",
      timestamp: "2024-03-13T20:10:00Z",
      read: true,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-500" />;
      case "comment":
        return (
          <MessageSquare className="w-4 h-4 text-blue-500" />
        );
      case "follow":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case "recommendation":
        return <Share className="w-4 h-4 text-purple-500" />;
      case "review":
        return <Star className="w-4 h-4 text-yellow-500" />;
      case "mention":
        return <Bell className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif,
      ),
    );
  };

  const markAllAsRead = async () => {
    setIsMarkingAllRead(true);

    // Animate notifications to read state
    await new Promise((resolve) => setTimeout(resolve, 300));

    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true })),
    );

    setIsMarkingAllRead(false);
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId),
    );
  };

  const filteredNotifications = notifications.filter(
    (notification) => {
      if (selectedTab !== "all") {
        const typeMatch = {
          interactions: ["like", "comment", "mention"].includes(
            notification.type,
          ),
          social: ["follow"].includes(notification.type),
          recommendations: ["recommendation"].includes(
            notification.type,
          ),
          reviews: ["review"].includes(notification.type),
        };
        if (!typeMatch[selectedTab as keyof typeof typeMatch])
          return false;
      }

      if (filter === "unread" && notification.read)
        return false;
      if (filter === "today") {
        const today = new Date().toDateString();
        const notificationDate = new Date(
          notification.timestamp,
        ).toDateString();
        if (today !== notificationDate) return false;
      }

      return true;
    },
  );

  const unreadCount = notifications.filter(
    (n) => !n.read,
  ).length;

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <FadeIn delay={0.1}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  bounce: 0.5,
                  delay: 0.2,
                }}
              >
                <Bell className="w-8 h-8" />
              </motion.div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl"
                >
                  Notifications
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground"
                >
                  Stay updated with your activity
                </motion.p>
              </div>
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                  >
                    <Badge className="ml-2">
                      {unreadCount} new
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as any)
                }
                className="text-sm border rounded px-3 py-2 bg-background transition-colors hover:bg-muted/50"
              >
                <option value="all">All notifications</option>
                <option value="unread">Unread only</option>
                <option value="today">Today</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={isMarkingAllRead || unreadCount === 0}
              >
                {isMarkingAllRead ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Mark all read
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
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
              <Card className="hover:shadow-md transition-all duration-300 hover:scale-105">
                <CardContent className="p-4 text-center">
                  <motion.div>
                    <Bell className="w-6 h-6 mx-auto mb-2 text-blue-500" />
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
                    {notifications.length}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Total
                  </p>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-md transition-all duration-300 hover:scale-105">
                <CardContent className="p-4 text-center">
                  <motion.div>
                    <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
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
                    {
                      notifications.filter(
                        (n) => n.type === "like",
                      ).length
                    }
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Likes
                  </p>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-md transition-all duration-300 hover:scale-105">
                <CardContent className="p-4 text-center">
                  <motion.div>
                    <UserPlus className="w-6 h-6 mx-auto mb-2 text-green-500" />
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
                    {
                      notifications.filter(
                        (n) => n.type === "follow",
                      ).length
                    }
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Follows
                  </p>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-md transition-all duration-300 hover:scale-105">
                <CardContent className="p-4 text-center">
                  <motion.div>
                    <MessageSquare className="w-6 h-6 mx-auto mb-2 text-purple-500" />
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
                    {
                      notifications.filter(
                        (n) => n.type === "comment",
                      ).length
                    }
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Comments
                  </p>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Notifications Content */}
        <FadeIn delay={0.8}>
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="interactions"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Interactions
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Social
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Suggestions
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              <AnimatePresence mode="wait">
                {filteredNotifications.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    >
                      <CheckCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    </motion.div>
                    <h3 className="text-lg mb-2">
                      {filter === "unread"
                        ? "All caught up!"
                        : "No notifications"}
                    </h3>
                    <p className="text-muted-foreground">
                      {filter === "unread"
                        ? "You're up to date with everything!"
                        : "No notifications to show"}
                    </p>
                  </motion.div>
                ) : (
                  <StaggerContainer
                    className="space-y-3"
                    staggerChildren={0.05}
                  >
                    {filteredNotifications.map(
                      (notification, index) => {
                        const user = users.find(
                          (u) => u.id === notification.userId,
                        );
                        const contentItem =
                          notification.contentId
                            ? content.find(
                                (c) =>
                                  c.id ===
                                  notification.contentId,
                              )
                            : null;

                        return (
                          <StaggerItem
                            key={notification.id}
                            index={index}
                          >
                            <motion.div
                              layout
                              exit={{
                                opacity: 0,
                                x: 100,
                                scale: 0.8,
                                transition: { duration: 0.2 },
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card
                                className={`group transition-all duration-300 hover:shadow-md cursor-pointer ${
                                  !notification.read
                                    ? "ring-2 ring-primary/20 bg-primary/5 hover:bg-primary/10"
                                    : "hover:bg-muted/30"
                                }`}
                                onClick={() =>
                                  markAsRead(notification.id)
                                }
                              >
                                <CardContent className="p-4 relative">
                                  {/* Clear button positioned in top right corner - outside padding */}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 w-7 h-7 p-0 bg-background/80 backdrop-blur-sm border border-border shadow-sm z-10"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(
                                        notification.id,
                                      );
                                    }}
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </Button>

                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 relative">
                                      {user && (
                                        <motion.div
                                          whileHover={{
                                            scale: 1.1,
                                          }}
                                          transition={{
                                            type: "spring",
                                            stiffness: 400,
                                          }}
                                        >
                                          <Avatar className="w-10 h-10">
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
                                      )}
                                      <motion.div
                                        className="absolute -bottom-1 -right-1 bg-background rounded-full p-1"
                                        whileHover={{
                                          scale: 1.2,
                                        }}
                                        transition={{
                                          type: "spring",
                                          stiffness: 400,
                                        }}
                                      >
                                        {getNotificationIcon(
                                          notification.type,
                                        )}
                                      </motion.div>
                                    </div>

                                    <div className="flex-1 min-w-0 pr-8">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm flex items-center gap-2">
                                            <span>
                                              <span className="font-medium">
                                                {
                                                  user?.displayName
                                                }
                                              </span>{" "}
                                              {
                                                notification.message
                                              }
                                            </span>
                                            <AnimatePresence>
                                              {!notification.read && (
                                                <motion.div
                                                  initial={{
                                                    scale: 0,
                                                  }}
                                                  animate={{
                                                    scale: 1,
                                                  }}
                                                  exit={{
                                                    scale: 0,
                                                  }}
                                                  className="w-2 h-2 bg-primary rounded-full flex-shrink-0"
                                                />
                                              )}
                                            </AnimatePresence>
                                          </p>
                                          {contentItem && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                              "
                                              {
                                                contentItem.title
                                              }
                                              "
                                            </p>
                                          )}
                                          <p className="text-xs text-muted-foreground mt-1">
                                            {getTimeAgo(
                                              notification.timestamp,
                                            )}
                                          </p>
                                        </div>
                                      </div>

                                      <AnimatePresence>
                                        {notification.actionRequired && (
                                          <motion.div
                                            initial={{
                                              opacity: 0,
                                              height: 0,
                                            }}
                                            animate={{
                                              opacity: 1,
                                              height: "auto",
                                            }}
                                            exit={{
                                              opacity: 0,
                                              height: 0,
                                            }}
                                            className="flex items-center gap-2 mt-3 overflow-hidden"
                                          >
                                            <Button
                                              size="sm"
                                              variant="default"
                                              className="hover:scale-105 transition-transform"
                                            >
                                              <Play className="w-3 h-3 mr-1" />
                                              Watch Now
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="hover:scale-105 transition-transform"
                                            >
                                              Add to Watchlist
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="hover:scale-105 transition-transform"
                                            >
                                              Not Interested
                                            </Button>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>

                                    {contentItem && (
                                      <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden">
                                        <motion.img
                                          src={
                                            contentItem.poster
                                          }
                                          alt={
                                            contentItem.title
                                          }
                                          className="w-full h-full object-cover"
                                          whileHover={{
                                            scale: 1.05,
                                          }}
                                          transition={{
                                            type: "spring",
                                            stiffness: 400,
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </StaggerItem>
                        );
                      },
                    )}
                  </StaggerContainer>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </PageTransition>
  );
}