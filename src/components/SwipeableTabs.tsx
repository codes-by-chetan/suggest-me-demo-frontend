import {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { motion, AnimatePresence } from "motion/react";

interface TabItem {
  value: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
}

interface SwipeableTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  tabsListClassName?: string;
}

export function SwipeableTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className = "w-full",
  tabsListClassName = "",
}: SwipeableTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultValue || tabs[0]?.value || "",
  );
  const activeTab =
    value !== undefined ? value : internalActiveTab;
  const [touchStart, setTouchStart] = useState<number | null>(
    null,
  );
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const handleTabChange = useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setInternalActiveTab(newValue);
      }
      onValueChange?.(newValue);
    },
    [value, onValueChange],
  );

  const getCurrentTabIndex = () =>
    tabs.findIndex((tab) => tab.value === activeTab);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    const currentIndex = getCurrentTabIndex();

    if (isLeftSwipe && currentIndex < tabs.length - 1) {
      // Swipe left - go to next tab
      handleTabChange(tabs[currentIndex + 1].value);
    }

    if (isRightSwipe && currentIndex > 0) {
      // Swipe right - go to previous tab
      handleTabChange(tabs[currentIndex - 1].value);
    }
  };

  // Auto-adjust grid columns based on number of tabs
  const getGridCols = () => {
    const count = tabs.length;
    if (count <= 3) return `grid-cols-[${count}]`;
    if (count <= 4) return "grid-cols-4";
    if (count <= 5) return "grid-cols-5";
    if (count <= 6) return "grid-cols-6";
    return "grid-cols-7";
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className={className}
    >
      <TabsList
        className={`flex w-full h-auto p-1 ${tabsListClassName}`}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm px-2 py-2 h-auto relative"
          >
            {/* Sliding background indicator for active tab */}
            {activeTab === tab.value && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-primary rounded-xl shadow-sm"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 35,
                  duration: 0.1,
                }}
              />
            )}

            {/* Mobile: Show icon for inactive tabs, text+icon for active tab */}
            <motion.span
              className="flex items-center gap-1.5 sm:hidden relative z-10"
              layout
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 35,
                duration: 0.1,
              }}
            >
              <motion.span
                layout
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                {tab.icon}
              </motion.span>
              <AnimatePresence mode="wait">
                {activeTab === tab.value && (
                  <motion.span
                    key="label"
                    className="text-xs font-medium whitespace-nowrap text-accent"
                    initial={{
                      opacity: 0,
                      width: 0,
                      marginLeft: 0,
                    }}
                    animate={{
                      opacity: 1,
                      width: "auto",
                      marginLeft: 6,
                      transition: {
                        opacity: { duration: 0.2, delay: 0.1 },
                        width: {
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        },
                        marginLeft: {
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      width: 0,
                      marginLeft: 0,
                      transition: {
                        opacity: { duration: 0.15 },
                        width: {
                          duration: 0.25,
                          ease: [0.4, 0, 0.2, 1],
                        },
                        marginLeft: {
                          duration: 0.25,
                          ease: [0.4, 0, 0.2, 1],
                        },
                      },
                    }}
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>

            {/* Desktop: Show both icon and text always */}
            <motion.span
              className={
                "hidden sm:flex items-center gap-1.5 relative z-10 ease-in-out"
              }
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {" "}
              {tab.icon}{" "}
              <span className="font-medium">
                {tab.label}
              </span>{" "}
            </motion.span>
          </TabsTrigger>
        ))}
      </TabsList>

      <div
        ref={tabContentRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="touch-pan-y"
      >
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mt-6"
            asChild
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
              exit={{
                opacity: 0,
                y: -10,
                transition: {
                  duration: 0.2,
                },
              }}
            >
              {tab.content}
            </motion.div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}