import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home,
  Compass,
  BookOpen,
  Users,
  List,
  Search,
  Bell,
  MessageSquare,
  User
} from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  notificationCount?: number;
  messageCount?: number;
}

export function MobileBottomNav({ 
  currentPage, 
  onNavigate, 
  notificationCount = 0, 
  messageCount = 0 
}: MobileBottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onNavigate(item.id)}
              className={`
                relative flex flex-col items-center justify-center gap-1 h-full rounded-none border-0 p-1
                ${isActive 
                  ? 'bg-primary text-white dark:text-black' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs leading-none">{item.label}</span>
              
              {/* Notification badges */}
              {item.id === 'social' && messageCount > 0 && (
                <Badge className="absolute top-1 right-2 h-4 w-4 flex items-center justify-center text-xs p-0 bg-red-500">
                  {messageCount > 9 ? '9+' : messageCount}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}