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
import {
  TrendingUp,
  Star,
  Filter,
  Grid,
  List,
  Play,
  Book,
  Music,
  Headphones,
  Flame,
  Plus,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DiscoverPageProps {
  content: Content[];
  users: User[];
  onContentClick: (content: Content) => void;
}

export function DiscoverPage({
  content,
  users,
  onContentClick,
}: DiscoverPageProps) {
  const [selectedCategory, setSelectedCategory] =
    useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    "grid",
  );

  const categories = [
    { id: "all", label: "All", icon: Grid },
    { id: "movie", label: "Movies", icon: Play },
    { id: "series", label: "Series", icon: Play },
    { id: "book", label: "Books", icon: Book },
    { id: "music", label: "Music", icon: Music },
    { id: "podcast", label: "Podcasts", icon: Headphones },
  ];

  const filteredContent =
    selectedCategory === "all"
      ? content
      : content.filter(
          (item) => item.type === selectedCategory,
        );

  const trendingContent = [...content]
    .sort((a, b) => b.stats.watched - a.stats.watched)
    .slice(0, 6);

  const topRatedContent = [...content]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const recentlyAdded = [...content]
    .sort((a, b) => b.year - a.year)
    .slice(0, 6);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <SlideInCard direction="up" delay={0.1}>
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <motion.div>
                  <Flame className="w-6 h-6 text-orange-500" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardTitle className="text-2xl">
                    Discover Amazing Content
                  </CardTitle>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent>
              <FadeIn delay={0.3}>
                <p className="text-muted-foreground mb-4">
                  Explore trending movies, series, books, music,
                  and podcasts recommended by our community.
                </p>
              </FadeIn>
              <div className="relative -mx-6 px-6 md:mx-0 md:px-0">
                <div className="overflow-x-auto pb-2 scrollbar-hide">
                  <StaggerContainer
                    className="flex flex-nowrap md:flex-wrap gap-2 min-w-min"
                    staggerChildren={0.05}
                    delayChildren={0.4}
                  >
                    {categories.map((category, index) => {
                      const Icon = category.icon;
                      return (
                        <StaggerItem
                          key={category.id}
                          index={index}
                          className="flex-shrink-0"
                        >
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant={
                                selectedCategory === category.id
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                setSelectedCategory(category.id)
                              }
                              className="flex items-center gap-2 transition-all duration-300 whitespace-nowrap"
                            >
                              <Icon className="w-4 h-4" />
                              {category.label}
                            </Button>
                          </motion.div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideInCard>

        {/* Quick Stats */}
        <StaggerContainer
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          staggerChildren={0.1}
          delayChildren={0.5}
        >
          <StaggerItem>
            <SlideInCard direction="up">
              <Card
                className="hover:shadow-md transition-all transition-transform transition-shadow duration-300 ease-in-out
 hover:scale-105 cursor-pointer"
              >
                <CardContent className="p-4 text-center">
                  <motion.div className="text-2xl mb-1">
                    🔥
                  </motion.div>
                  <motion.div className="text-2xl">
                    {content.length}
                  </motion.div>
                  <p className="text-sm text-muted-foreground">
                    Total Content
                  </p>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-md transition-all transition-transform transition-shadow duration-300 ease-in-out hover:scale-105 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <motion.div className="text-2xl mb-1">
                    ⭐
                  </motion.div>
                  <motion.div className="text-2xl">
                    {users.length}
                  </motion.div>
                  <p className="text-sm text-muted-foreground">
                    Active Users
                  </p>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-md transition-all transition-transform transition-shadow duration-300 ease-in-out hover:scale-105 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <motion.div className="text-2xl mb-1">
                    📈
                  </motion.div>
                  <motion.div className="text-2xl">
                    4.2
                  </motion.div>
                  <p className="text-sm text-muted-foreground">
                    Avg Rating
                  </p>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
          <StaggerItem>
            <SlideInCard direction="up">
              <Card className="hover:shadow-md transition-all transition-transform transition-shadow duration-300 ease-in-out hover:scale-105 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <motion.div className="text-2xl mb-1">
                    💬
                  </motion.div>
                  <motion.div className="text-2xl">
                    1.2k
                  </motion.div>
                  <p className="text-sm text-muted-foreground">
                    Reviews
                  </p>
                </CardContent>
              </Card>
            </SlideInCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Content Sections */}
        <FadeIn delay={0.8}>
          <div className="space-y-4">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h2 className="text-2xl">Explore Content</h2>
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={
                      viewMode === "grid"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="transition-all duration-300"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={
                      viewMode === "list"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="transition-all duration-300"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <SlideInCard direction="up" delay={1.0}>
              <SwipeableTabs
                defaultValue="trending"
                tabs={[
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
                          <motion.div>
                            <TrendingUp className="w-5 h-5 text-orange-500" />
                          </motion.div>
                          <h2 className="text-xl">
                            Trending Now
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
                              {trendingContent.length} items
                            </Badge>
                          </motion.div>
                        </motion.div> */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={viewMode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <StaggerContainer
                              className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"}`}
                              staggerChildren={0.05}
                              delayChildren={0.4}
                            >
                              {trendingContent.map(
                                (item, index) => (
                                  <StaggerItem
                                    key={item.id}
                                    index={index}
                                  >
                                    <ContentCard
                                      content={item}
                                      onCardClick={
                                        onContentClick
                                      }
                                      compact={
                                        viewMode === "list"
                                      }
                                    />
                                  </StaggerItem>
                                ),
                              )}
                            </StaggerContainer>
                            <div className="min-h-[300px] w-full"></div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    ),
                  },
                  {
                    value: "toprated",
                    label: "Top Rated",
                    icon: <Star className="w-4 h-4" />,
                    content: (
                      <div className="space-y-4 ">
                        {/* <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <motion.div>
                            <Star className="w-5 h-5 text-yellow-500" />
                          </motion.div>
                          <h2 className="text-xl">Top Rated</h2>
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
                              {topRatedContent.length} items
                            </Badge>
                          </motion.div>
                        </motion.div> */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={viewMode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <StaggerContainer
                              className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"}`}
                              staggerChildren={0.05}
                              delayChildren={0.4}
                            >
                              {topRatedContent.map(
                                (item, index) => (
                                  <StaggerItem
                                    key={item.id}
                                    index={index}
                                  >
                                    <ContentCard
                                      content={item}
                                      onCardClick={
                                        onContentClick
                                      }
                                      compact={
                                        viewMode === "list"
                                      }
                                    />
                                  </StaggerItem>
                                ),
                              )}
                            </StaggerContainer>
                            <div className="min-h-[300px] w-full"></div>
                          </motion.div>
                        </AnimatePresence>
                        <div className="h-[300px]"></div>
                      </div>
                    ),
                  },
                  {
                    value: "recent",
                    label: "Recent",
                    icon: <Activity className="w-4 h-4" />,
                    content: (
                      <div className="space-y-4">
                        {/* <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <motion.div>
                            <Activity className="w-5 h-5 text-yellow-500" />
                            <Badge className="w-5 h-5 rounded-full p-1 flex items-center justify-center ">
                              New
                            </Badge>
                          </motion.div>
                          <h2 className="text-xl">
                            Recently Added
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
                              {recentlyAdded.length} items
                            </Badge>
                          </motion.div>
                        </motion.div> */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={viewMode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <StaggerContainer
                              className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"}`}
                              staggerChildren={0.05}
                              delayChildren={0.4}
                            >
                              {recentlyAdded.map(
                                (item, index) => (
                                  <StaggerItem
                                    key={item.id}
                                    index={index}
                                  >
                                    <ContentCard
                                      content={item}
                                      onCardClick={
                                        onContentClick
                                      }
                                      compact={
                                        viewMode === "list"
                                      }
                                    />
                                  </StaggerItem>
                                ),
                              )}
                            </StaggerContainer>
                            <div className="min-h-[300px] w-full"></div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    ),
                  },
                  {
                    value: "browse",
                    label: "Browse",
                    icon: <Filter className="w-4 h-4" />,
                    content: (
                      <div className="space-y-4">
                        {/* <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <motion.div>
                            <Filter className="w-5 h-5" />
                          </motion.div>
                          <h2 className="text-xl">
                            Browse All Content
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
                              {filteredContent.length} items
                            </Badge>
                          </motion.div>
                        </motion.div> */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${viewMode}-${selectedCategory}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <StaggerContainer
                              className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"}`}
                              staggerChildren={0.05}
                              delayChildren={0.4}
                            >
                              {filteredContent.map(
                                (item, index) => (
                                  <StaggerItem
                                    key={item.id}
                                    index={index}
                                  >
                                    <ContentCard
                                      content={item}
                                      onCardClick={
                                        onContentClick
                                      }
                                      compact={
                                        viewMode === "list"
                                      }
                                    />
                                  </StaggerItem>
                                ),
                              )}
                            </StaggerContainer>
                            <div className="min-h-[300px] w-full"></div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    ),
                  },
                ]}
              />
            </SlideInCard>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}