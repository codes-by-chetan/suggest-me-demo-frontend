import { useState } from "react";
import { Recommendation, User, Content } from "../types";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ChatSystem } from "./ChatSystem";
import { ShareDialog } from "./ShareDialog";
import {
  Star,
  MessageCircle,
  Heart,
  Share2,
  Eye,
  Plus,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import {
  StaggerContainer,
  StaggerItem,
} from "./PageTransition";

interface RecommendationsFeedProps {
  recommendations: Recommendation[];
  users: User[];
  content: Content[];
  currentUserId: string;
  onContentClick?: (content: Content) => void;
}

export function RecommendationsFeed({
  recommendations,
  users,
  content,
  currentUserId,
  onContentClick,
}: RecommendationsFeedProps) {
  const [likedRecommendations, setLikedRecommendations] =
    useState<Set<string>>(new Set());
  const [activeChatId, setActiveChatId] = useState<
    string | null
  >(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareData, setShareData] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const formatTime = (timestamp: string) => {
    const time = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - time.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    console.log(days);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 100) return `${days}d ago`;
    if (days < 365)
      return `${months} month${months > 1 ? "s" : ""} ago`;
    return `more than ${years} year${years > 1 ? "s" : ""} ago`;
  };

  const handleLike = (recommendationId: string) => {
    setLikedRecommendations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recommendationId)) {
        newSet.delete(recommendationId);
      } else {
        newSet.add(recommendationId);
      }
      return newSet;
    });
  };

  const handleShare = (
    recommendation: Recommendation,
    contentItem: Content,
  ) => {
    const fromUser = users.find(
      (u) => u.id === recommendation.fromUserId,
    );
    setShareData({
      title: contentItem.title,
      description: `Recommended by ${fromUser?.displayName}: "${recommendation.message}"`,
    });
    setShareDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl">
          Recommendations from Friends
        </h2>
      </motion.div> */}

      <StaggerContainer
        className="space-y-4"
        staggerChildren={0.1}
      >
        {recommendations.map((rec, index) => {
          const fromUser = users.find(
            (u) => u.id === rec.fromUserId,
          );
          const contentItem = content.find(
            (c) => c.id === rec.contentId,
          );

          if (!fromUser || !contentItem) return null;

          return (
            <StaggerItem key={rec.id} index={index}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-3 md:p-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    {/* User Avatar */}
                    <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                      <AvatarImage
                        src={fromUser.avatar}
                        alt={fromUser.displayName}
                      />
                      <AvatarFallback>
                        {fromUser.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium truncate">
                            {fromUser.displayName}
                          </span>
                          <span className="text-muted-foreground text-sm hidden sm:inline">
                            recommends
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs flex-shrink-0"
                          >
                            {contentItem.type}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground sm:ml-auto">
                          {formatTime(rec.timestamp)}
                        </span>
                      </div>

                      {/* Mobile "recommends" text */}
                      <div className="sm:hidden mb-2">
                        <span className="text-muted-foreground text-sm">
                          recommends
                        </span>
                      </div>

                      {/* Recommendation Message */}
                      <p className="text-sm text-muted-foreground mb-4 break-words">
                        "{rec.message}"
                      </p>

                      {/* Content Preview */}
                      <div
                        className="flex flex-col sm:flex-row gap-3 p-3 md:p-4 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                        onClick={() =>
                          onContentClick?.(contentItem)
                        }
                      >
                        <ImageWithFallback
                          src={contentItem.poster}
                          alt={contentItem.title}
                          className="w-full sm:w-16 md:w-20 h-48 sm:h-24 md:h-28 object-cover rounded flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0 space-y-2">
                          <h4 className="font-medium truncate">
                            {contentItem.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {contentItem.year} •{" "}
                            {contentItem.genre
                              .slice(0, 2)
                              .join(", ")}
                          </p>

                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                            <span className="text-sm">
                              {contentItem.rating}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              (
                              {contentItem.totalRatings.toLocaleString()}
                              )
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2 hidden sm:block">
                            {contentItem.description}
                          </p>

                          {/* Engagement Stats */}
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-muted-foreground">
                            <span className="whitespace-nowrap">
                              {contentItem.stats.watched.toLocaleString()}{" "}
                              watched
                            </span>
                            <span className="whitespace-nowrap">
                              {contentItem.stats.watching.toLocaleString()}{" "}
                              watching
                            </span>
                            <span className="whitespace-nowrap hidden sm:inline">
                              {contentItem.stats.watchlist.toLocaleString()}{" "}
                              watchlist
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        <span className="flex flex-wrap gap-1">
                          <Heart
                            className={`w-4 h-4 mr-1 cursor-pointer ${likedRecommendations.has(rec.id) ? "fill-red-500" : ""}`}
                            onClick={() => handleLike(rec.id)}
                          />{" "}
                          {/* <span className="sm:hidden">
                            {likedRecommendations.has(rec.id)
                              ? "❤️"
                              : "🤍"}
                          </span> */}
                          <span className=" text-xs">900</span>
                        </span>

                        <span className="flex flex-wrap gap-1">
                          <MessageCircle
                            className="w-4 h-4 sm:mr-1 cursor-pointer "
                            onClick={() =>
                              setActiveChatId(rec.id)
                            }
                          />{" "}
                          <span className="  text-xs">450</span>
                        </span>

                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onContentClick?.(contentItem)
                          }
                          className="text-xs px-3"
                        > */}
                        {/* </Button> */}

                        <span className="flex flex-wrap gap-1">
                          <Eye className="w-4 h-4 sm:mr-1" />
                          <span className="sm:inline text-xs">
                            600{" "}
                            <span className="hidden sm:inline">
                              people watched this
                            </span>
                          </span>
                        </span>

                        <Plus className="w-4 h-4 sm:mr-1 cursor-pointer hover:text-primary transition-colors" />

                        <Share2
                          className="w-4 h-4 sm:mr-1 cursor-pointer hover:text-primary transition-colors"
                          onClick={() =>
                            handleShare(rec, contentItem)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Chat System */}
      {activeChatId && (
        <ChatSystem
          recommendationId={activeChatId}
          users={users}
          currentUserId={currentUserId}
          isOpen={true}
          onClose={() => setActiveChatId(null)}
        />
      )}

      {/* Share Dialog */}
      {shareData && (
        <ShareDialog
          isOpen={shareDialogOpen}
          onClose={() => {
            setShareDialogOpen(false);
            setShareData(null);
          }}
          title={shareData.title}
          description={shareData.description}
        />
      )}
    </div>
  );
}