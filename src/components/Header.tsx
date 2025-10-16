import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ThemeSettings } from './ThemeSettings';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NotificationsPopup } from './NotificationsPopup';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut, 
  Home,
  Compass,
  BookOpen,
  Users,

  List
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  currentUser?: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  onNavigate?: (page: string, searchQuery?: string) => void;
  currentPage?: string;
  users?: any[];
  content?: any[];
}

export function Header({ currentUser, onNavigate, currentPage = 'home', users = [], content = [] }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotificationsPopup, setShowNotificationsPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNotificationClick = () => {
    if (isMobile) {
      // On mobile, navigate directly to notifications page
      onNavigate?.('notifications');
    } else {
      // On desktop, show popup
      setShowNotificationsPopup(true);
    }
  };



  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate?.('home')}>
            <div className="w-8 h-8  overflow-hidden">
              <ImageWithFallback
                src="https://suggest-me-prototype.netlify.app/suggestMeLogo.png"
                alt="Suggest.Me Logo"
                className="w-full h-full object-cover hidden dark:block"
              />
              <ImageWithFallback
                src="https://suggest-me-prototype.netlify.app/suggestMeLogoDark.png"
                alt="Suggest.Me Logo"
                className="w-full h-full object-cover block dark:hidden"
              />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Suggest<span className="text-accent-foreground font-bold">.Me</span>
            </h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'discover', label: 'Discover', icon: Compass },
              { id: 'library', label: 'My Library', icon: BookOpen },
              { id: 'recommendations', label: 'My Suggestions', icon: List },
              { id: 'social', label: 'Social', icon: Users },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate?.(item.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search content, users, or reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  onNavigate?.('search', searchQuery);
                }
              }}
              onFocus={() => {
                if (currentPage !== 'search') {
                  onNavigate?.('search', searchQuery);
                }
              }}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs"
                onClick={() => onNavigate?.('search', searchQuery)}
              >
                View All
              </Button>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Settings */}
          <ThemeSettings />

          {/* Notifications - Hidden on mobile */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative hidden md:flex" 
            onClick={handleNotificationClick}
          >
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
              3
            </Badge>
          </Button>

          {/* Messages - Hidden on mobile */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative hidden md:flex"
            onClick={() => onNavigate?.('chat')}
          >
            <MessageSquare className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
              7
            </Badge>
          </Button>

          {/* User Menu - Mobile shows only avatar, desktop shows full menu */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
                    <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{currentUser.displayName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      @{currentUser.username}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate?.('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate?.('library')}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Library
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate?.('recommendations')}>
                  <List className="mr-2 h-4 w-4" />
                  My Suggestions
                </DropdownMenuItem>
                {/* Mobile-only menu items */}
                <div className="md:hidden">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleNotificationClick}>
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                    <Badge className="ml-auto h-5 w-5 flex items-center justify-center text-xs p-0">
                      3
                    </Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate?.('chat')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                    <Badge className="ml-auto h-5 w-5 flex items-center justify-center text-xs p-0">
                      7
                    </Badge>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate?.('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                Sign In
              </Button>
              <Button size="sm">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>


      {/* Notifications Popup */}
      {currentUser && (
        <NotificationsPopup
          users={users}
          content={content}
          currentUserId={currentUser.id}
          onViewAll={() => {
            setShowNotificationsPopup(false);
            onNavigate?.('notifications');
          }}
          onClose={() => setShowNotificationsPopup(false)}
          isOpen={showNotificationsPopup}
        />
      )}
    </header>
  );
}