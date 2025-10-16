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
            className="flex-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm px-2 py-2 h-auto"
          >
            {/* Mobile: Show icon for inactive tabs, text+icon for active tab */}
            <span className="flex items-center gap-1.5 sm:hidden">
              {tab.icon}
              {activeTab === tab.value && (
                <span className="text-xs font-medium">{tab.label}</span>
              )}
            </span>

            {/* Desktop: Show both icon and text always */}
            <span className="hidden sm:flex items-center gap-1.5">
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </span>
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
          >
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}