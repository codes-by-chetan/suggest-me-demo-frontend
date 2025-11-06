import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Home,
  Compass,
  BookOpen,
  List,
  Users,
  X,
} from "lucide-react";

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate?: (page: string) => void;
}

export function NavigationSidebar({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
}: NavigationSidebarProps) {
  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "discover", label: "Discover", icon: Compass },
    { id: "library", label: "My Library", icon: BookOpen },
    {
      id: "recommendations",
      label: "My Suggestions",
      icon: List,
    },
    { id: "social", label: "Social", icon: Users },
  ];

  const handleNavigate = (page: string) => {
    onNavigate?.(page);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-transparent border-r shadow-lg z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-">
                    {/* <img
                      src="https://suggest-me-prototype.netlify.app/suggestMeLogoDark.png"
                      alt="Suggest.Me Logo"
                      className="w-full h-full object-cover"
                    /> */}
                  </div>
                  {/* <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Suggest
                    <span className="text-accent-foreground">
                      .Me
                    </span>
                  </h2> */}
                </div>
                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-5 h-5" />
                </Button> */}
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start gap-3 h-12 cursor-pointer"
                        onClick={() => handleNavigate(item.id)}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-base">
                          {item.label}
                        </span>
                      </Button>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <p className="text-xs text-foreground text-center">
                  © 2024 Suggest.Me
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}