import { useState } from "react";
import { Recommendation, User, Content } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  PageTransition,
  StaggerContainer,
  StaggerItem,
  SlideInCard,
  FadeIn,
} from "./PageTransition";
import {
  Plus,
  Send,
  Edit,
  Trash2,
  MessageSquare,
  Heart,
  Eye,
  Search,
  Filter,
  UserPlus,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";

interface RecommendationsManagerProps {
  recommendations: Recommendation[];
  users: User[];
  content: Content[];
  currentUserId: string;
  onContentClick?: (content: Content) => void;
}

export function RecommendationsManager({
  recommendations,
  users,
  content,
  currentUserId,
  onContentClick,
}: RecommendationsManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "sent" | "received"
  >("all");
  const [isNewRecommendationOpen, setIsNewRecommendationOpen] =
    useState(false);
  const [selectedContent, setSelectedContent] =
    useState<Content | null>(null);
  const [selectedRecipient, setSelectedRecipient] =
    useState<string>("");
  const [recommendationMessage, setRecommendationMessage] =
    useState("");

  // Filter recommendations
  const filteredRecommendations = recommendations.filter(
    (rec) => {
      const matchesSearch =
        searchQuery === "" ||
        content
          .find((c) => c.id === rec.contentId)
          ?.title.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        users
          .find((u) => u.id === rec.fromUserId)
          ?.displayName.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        users
          .find((u) => u.id === rec.toUserId)
          ?.displayName.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "sent" &&
          rec.fromUserId === currentUserId) ||
        (filterStatus === "received" &&
          rec.toUserId === currentUserId);

      return matchesSearch && matchesFilter;
    },
  );

  const sentRecommendations = recommendations.filter(
    (r) => r.fromUserId === currentUserId,
  );
  const receivedRecommendations = recommendations.filter(
    (r) => r.toUserId === currentUserId,
  );

  const handleCreateRecommendation = () => {
    if (
      !selectedContent ||
      !selectedRecipient ||
      !recommendationMessage.trim()
    )
      return;

    // In a real app, this would submit to the backend
    console.log("Creating recommendation:", {
      contentId: selectedContent.id,
      toUserId: selectedRecipient,
      message: recommendationMessage,
    });

    // Reset form
    setSelectedContent(null);
    setSelectedRecipient("");
    setRecommendationMessage("");
    setIsNewRecommendationOpen(false);
  };

  const formatTime = (timestamp: string) => {
    const time = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <FadeIn delay={0.1}>
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Manage Recommendations
              </motion.h1>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Create, track, and manage your content
                suggestions
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                bounce: 0.6,
              }}
            >
              <Dialog
                open={isNewRecommendationOpen}
                onOpenChange={setIsNewRecommendationOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Recommendation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      Create New Recommendation
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Content Selection */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="text-sm mb-2 block">
                        Select Content
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                        {content.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.3 + index * 0.05,
                            }}
                          >
                            <Card
                              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                                selectedContent?.id === item.id
                                  ? "ring-2 ring-primary shadow-lg"
                                  : ""
                              }`}
                              onClick={() =>
                                setSelectedContent(item)
                              }
                            >
                              <CardContent className="p-3">
                                <ImageWithFallback
                                  src={item.poster}
                                  alt={item.title}
                                  className="w-full h-24 object-cover rounded mb-2"
                                />
                                <p className="text-sm truncate">
                                  {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.year}
                                </p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Recipient Selection */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="text-sm mb-2 block">
                        Send to
                      </label>
                      <Select
                        value={selectedRecipient}
                        onValueChange={setSelectedRecipient}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a friend" />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            .filter(
                              (u) => u.id !== currentUserId,
                            )
                            .map((user) => (
                              <SelectItem
                                key={user.id}
                                value={user.id}
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={user.avatar}
                                    alt={user.displayName}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  {user.displayName}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </motion.div>

                    {/* Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="text-sm mb-2 block">
                        Your message
                      </label>
                      <Textarea
                        placeholder="Tell them why you recommend this..."
                        value={recommendationMessage}
                        onChange={(e) =>
                          setRecommendationMessage(
                            e.target.value,
                          )
                        }
                        rows={3}
                      />
                    </motion.div>

                    <motion.div
                      className="flex gap-2 justify-end"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() =>
                          setIsNewRecommendationOpen(false)
                        }
                      >
                        Cancel
                      </Button>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleCreateRecommendation}
                          disabled={
                            !selectedContent ||
                            !selectedRecipient ||
                            !recommendationMessage.trim()
                          }
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Recommendation
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </FadeIn>

        {/* Stats Cards */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          staggerChildren={0.1}
          delayChildren={0.4}
        >
          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <motion.div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Send className="w-6 h-6 text-blue-600" />
                    </motion.div>
                    <div>
                      <motion.p
                        className="text-2xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.6,
                          type: "spring",
                          bounce: 0.6,
                        }}
                      >
                        {sentRecommendations.length}
                      </motion.p>
                      <p className="text-sm text-muted-foreground">
                        Sent
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>

          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <motion.div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-green-600" />
                    </motion.div>
                    <div>
                      <motion.p
                        className="text-2xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.7,
                          type: "spring",
                          bounce: 0.6,
                        }}
                      >
                        {receivedRecommendations.length}
                      </motion.p>
                      <p className="text-sm text-muted-foreground">
                        Received
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>

          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <motion.div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </motion.div>
                    <div>
                      <motion.p
                        className="text-2xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.8,
                          type: "spring",
                          bounce: 0.6,
                        }}
                      >
                        12
                      </motion.p>
                      <p className="text-sm text-muted-foreground">
                        Discussions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Filters and Search */}
        <SlideInCard direction="up" delay={0.8}>
          <Card className="hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search recommendations..."
                      value={searchQuery}
                      onChange={(e) =>
                        setSearchQuery(e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <Select
                    value={filterStatus}
                    onValueChange={(value: any) =>
                      setFilterStatus(value)
                    }
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        All Recommendations
                      </SelectItem>
                      <SelectItem value="sent">
                        Sent by Me
                      </SelectItem>
                      <SelectItem value="received">
                        Received
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </SlideInCard>

        {/* Recommendations List */}
        <FadeIn delay={1.1}>
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {filteredRecommendations.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-12 text-center">
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
                        <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      </motion.div>
                      <h3 className="mb-2">
                        No recommendations found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery
                          ? "Try a different search term"
                          : "Start by creating your first recommendation"}
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() =>
                            setIsNewRecommendationOpen(true)
                          }
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Recommendation
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <StaggerContainer
                  staggerChildren={0.1}
                  delayChildren={1.2}
                >
                  {filteredRecommendations.map((rec, index) => {
                    const fromUser = users.find(
                      (u) => u.id === rec.fromUserId,
                    );
                    const toUser = users.find(
                      (u) => u.id === rec.toUserId,
                    );
                    const contentItem = content.find(
                      (c) => c.id === rec.contentId,
                    );

                    if (!fromUser || !toUser || !contentItem)
                      return null;

                    const isSentByCurrentUser =
                      rec.fromUserId === currentUserId;

                    return (
                      <StaggerItem key={rec.id} index={index}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex gap-4">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                  }}
                                >
                                  <ImageWithFallback
                                    src={contentItem.poster}
                                    alt={contentItem.title}
                                    className="w-20 h-28 object-cover rounded cursor-pointer"
                                    onClick={() =>
                                      onContentClick?.(
                                        contentItem,
                                      )
                                    }
                                  />
                                </motion.div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{
                                        delay:
                                          1.4 + index * 0.1,
                                        type: "spring",
                                        bounce: 0.6,
                                      }}
                                    >
                                      <Badge
                                        variant={
                                          isSentByCurrentUser
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {isSentByCurrentUser
                                          ? "Sent"
                                          : "Received"}
                                      </Badge>
                                    </motion.div>
                                    <span className="text-sm text-muted-foreground">
                                      {formatTime(
                                        rec.timestamp,
                                      )}
                                    </span>
                                  </div>

                                  <motion.h3
                                    className="mb-2 cursor-pointer hover:text-primary transition-colors"
                                    onClick={() =>
                                      onContentClick?.(
                                        contentItem,
                                      )
                                    }
                                    whileHover={{ x: 5 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 400,
                                    }}
                                  >
                                    {contentItem.title}
                                  </motion.h3>

                                  <div className="flex items-center gap-2 mb-3">
                                    <motion.div
                                      whileHover={{
                                        scale: 1.1,
                                      }}
                                    >
                                      <Avatar className="w-6 h-6">
                                        <AvatarImage
                                          src={fromUser.avatar}
                                          alt={
                                            fromUser.displayName
                                          }
                                        />
                                        <AvatarFallback>
                                          {fromUser.displayName.charAt(
                                            0,
                                          )}
                                        </AvatarFallback>
                                      </Avatar>
                                    </motion.div>
                                    <span className="text-sm text-muted-foreground">
                                      {isSentByCurrentUser
                                        ? `to ${toUser.displayName}`
                                        : `from ${fromUser.displayName}`}
                                    </span>
                                  </div>

                                  <p className="text-sm text-muted-foreground mb-4">
                                    "{rec.message}"
                                  </p>

                                  <StaggerContainer
                                    className="flex items-center gap-2"
                                    staggerChildren={0.05}
                                    delayChildren={
                                      1.6 + index * 0.1
                                    }
                                  >
                                    <StaggerItem>
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
                                        >
                                          <MessageSquare className="w-4 h-4 mr-1" />
                                          Chat
                                        </Button>
                                      </motion.div>
                                    </StaggerItem>
                                    <StaggerItem>
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
                                            onContentClick?.(
                                              contentItem,
                                            )
                                          }
                                        >
                                          <Eye className="w-4 h-4 mr-1" />
                                          View Content
                                        </Button>
                                      </motion.div>
                                    </StaggerItem>
                                    {isSentByCurrentUser && (
                                      <>
                                        <StaggerItem>
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
                                            >
                                              <Edit className="w-4 h-4 mr-1" />
                                              Edit
                                            </Button>
                                          </motion.div>
                                        </StaggerItem>
                                        <StaggerItem>
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
                                            >
                                              <Trash2 className="w-4 h-4 mr-1" />
                                              Delete
                                            </Button>
                                          </motion.div>
                                        </StaggerItem>
                                      </>
                                    )}
                                  </StaggerContainer>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}