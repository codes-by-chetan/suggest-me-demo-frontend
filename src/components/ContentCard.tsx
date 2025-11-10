// ContentCard.tsx
import React, { useState } from "react";
import { motion } from "motion/react"; // you used this previously; adjust to 'framer-motion' if needed
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  BookOpen,
  Film,
  Music,
  Tv,
  Mic,
  Star,
  Plus,
  Check,
  Clock,
  Heart,
  X,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAmbientColor } from "../hooks/useAmbientColor";
import { Content, WatchStatus } from "../types";

interface ContentCardProps {
  content: Content;
  onCardClick?: (content: Content) => void;
  compact?: boolean;
}

const getTypeIcon = (type: Content["type"]) => {
  switch (type) {
    case "movie":
      return <Film className="w-4 h-4" />;
    case "series":
      return <Tv className="w-4 h-4" />;
    case "book":
      return <BookOpen className="w-4 h-4" />;
    case "music":
      return <Music className="w-4 h-4" />;
    case "podcast":
      return <Mic className="w-4 h-4" />;
    default:
      return <Film className="w-4 h-4" />;
  }
};

const getStatusColor = (status: WatchStatus) => {
  switch (status) {
    case "watched":
      return "bg-green-500";
    case "watching":
      return "bg-blue-500";
    case "watchlist":
      return "bg-yellow-500";
    case "interested":
      return "bg-purple-500";
    case "not_interested":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getAspectRatio = (type: Content["type"]) => {
  switch (type) {
    case "music":
      return "aspect-square";
    case "movie":
    case "series":
    case "book":
    case "podcast":
    default:
      return "aspect-[2/3]";
  }
};

export function ContentCard({
  content,
  onCardClick,
  compact = false,
}: ContentCardProps) {
  const [watchStatus, setWatchStatus] =
    useState<WatchStatus>(null);
  const ambientColor = useAmbientColor(content.poster);

  const handleStatusChange = (
    status: WatchStatus,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setWatchStatus((prev) => (prev === status ? null : status));
  };

  const handleCardClick = () => onCardClick?.(content);

  // ---- COMPACT / LIST VIEW (unchanged from your previous design, small tweaks) ----
  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        <Card
          className="group cursor-pointer transition-all w-full !pb-0"
          onClick={handleCardClick}
        >
          <CardContent className="p-0">
            <div className="flex gap-3 p-3">
              <div className="relative flex-shrink-0">
                <div
                  className={`w-16 sm:w-28 ${getAspectRatio(content.type)} relative overflow-hidden rounded-lg`}
                >
                  <ImageWithFallback
                    src={content.poster}
                    alt={content.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {watchStatus && (
                    <div
                      className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getStatusColor(watchStatus)}`}
                    />
                  )}
                  <Badge
                    className="absolute top-1 left-1 text-xs px-1 py-0.5"
                    variant="secondary"
                  >
                    {getTypeIcon(content.type)}
                  </Badge>
                </div>

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={
                        watchStatus === "watched"
                          ? "default"
                          : "secondary"
                      }
                      onClick={(e) =>
                        handleStatusChange("watched", e)
                      }
                      className="h-6 w-6 p-0"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        watchStatus === "watching"
                          ? "default"
                          : "secondary"
                      }
                      onClick={(e) =>
                        handleStatusChange("watching", e)
                      }
                      className="h-6 w-6 p-0"
                    >
                      <Clock className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        watchStatus === "watchlist"
                          ? "default"
                          : "secondary"
                      }
                      onClick={(e) =>
                        handleStatusChange("watchlist", e)
                      }
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-medium line-clamp-1 flex-1">
                    {content.title}
                  </h3>
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">
                      {content.rating}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-1">
                  {content.year} •{" "}
                  {content.genre.slice(0, 2).join(", ")}
                </p>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {content.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {content.stats.watched.toLocaleString()}{" "}
                    watched
                  </span>
                  <span className="hidden sm:inline">
                    {content.stats.watching.toLocaleString()}{" "}
                    watching
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ---- GRID VIEW (prime-like hover card) ----
  return (
    // Important: parent should be overflow-visible in grid/list so expanded card isn't clipped
    <motion.div
      className="group relative hover:z-[30]"
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <Card
        className="cursor-pointer overflow-visible shadow-md hover:shadow-2xl transition-shadow duration-300 w-full max-w-[120px] sm:max-w-sm mx-auto"
        onClick={handleCardClick}
      >
        <CardContent className="p-0 relative overflow-visible !pb-0">
          {/* Poster */}
          <div
            className="relative w-full h-[300px] sm:h-[340px] overflow-hidden rounded-lg"
            style={{ backgroundColor: ambientColor }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <div
                className={`${getAspectRatio(content.type)} ${getAspectRatio(content.type) === "aspect-square" ? "w-full max-w-[95%]" : "h-full max-h-full"} relative overflow-hidden rounded shadow-md`}
              >
                <ImageWithFallback
                  src={content.poster}
                  alt={content.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Top-right status dot */}
            {watchStatus && (
              <div
                className={`absolute top-3 right-3 w-3 h-3 rounded-full ${getStatusColor(watchStatus)} z-20 transition-opacity duration-150`}
              />
            )}

            {/* Type Badge */}
            <div className="absolute top-3 left-3 z-20">
              <Badge
                variant="secondary"
                className="flex items-center gap-2"
              >
                {getTypeIcon(content.type)}
                <span className="text-xs capitalize hidden sm:inline">
                  {content.type}
                </span>
              </Badge>
            </div>

            {/* Hover quick actions over poster */}
            <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
              {/* invisible by default, pointer-events none ensures clicks go to card unless buttons shown */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={
                      watchStatus === "watched"
                        ? "default"
                        : "secondary"
                    }
                    onClick={(e) =>
                      handleStatusChange("watched", e)
                    }
                    className="h-8 w-8 p-0"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      watchStatus === "watching"
                        ? "default"
                        : "secondary"
                    }
                    onClick={(e) =>
                      handleStatusChange("watching", e)
                    }
                    className="h-8 w-8 p-0"
                  >
                    <Clock className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      watchStatus === "watchlist"
                        ? "default"
                        : "secondary"
                    }
                    onClick={(e) =>
                      handleStatusChange("watchlist", e)
                    }
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* DETAILS PANEL - hidden by default, expands on group hover */}
          <div
            // Position below the poster so it appears to grow out of the poster; using max-h transition for smoothness.
            className="hidden group-hover:block absolute  left-0 right-0 top-[95%] mt-2 rounded-b-lg bg-card border border-t-0 border-border shadow-xl overflow-hidden transform-gpu"
            style={{ willChange: "transform, opacity" }}
          >
            {/* inner wrapper that transitions height and opacity using max-h trick */}
            <div className="max-h-0 opacity-0 group-hover:max-h-[420px] group-hover:opacity-100 transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                    {content.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm flex-shrink-0">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">
                      {content.rating}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  {content.year} •{" "}
                  {content.genre.slice(0, 3).join(", ")}
                </p>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {content.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
                  <span>
                    {content.stats.watched.toLocaleString()}{" "}
                    watched
                  </span>
                  <span>
                    {content.stats.watching.toLocaleString()}{" "}
                    watching
                  </span>
                </div>

                {/* row of actions (mirrors Prime) */}
                <div className="pt-2 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation(); /* play or open */
                    }}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play
                  </Button>

                  <Button
                    size="sm"
                    variant={
                      watchStatus === "watchlist"
                        ? "default"
                        : "secondary"
                    }
                    onClick={(e) =>
                      handleStatusChange("watchlist", e)
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add
                  </Button>

                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={
                        watchStatus === "interested"
                          ? "default"
                          : "secondary"
                      }
                      onClick={(e) =>
                        handleStatusChange("interested", e)
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        watchStatus === "not_interested"
                          ? "destructive"
                          : "secondary"
                      }
                      onClick={(e) =>
                        handleStatusChange("not_interested", e)
                      }
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ContentCard;