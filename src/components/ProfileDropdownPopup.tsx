import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { User, BookOpen, List, Settings, LogOut, Bell, MessageSquare } from 'lucide-react';
import { Badge } from './ui/badge';
import { useProfileDropdown } from '../contexts/ProfileDropdownContext';

interface ProfileDropdownPopupProps {
  currentUser?: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  onNavigate?: (page: string) => void;
  isMobile?: boolean;
  onNotificationClick?: () => void;
}

export function ProfileDropdownPopup({ 
  currentUser, 
  onNavigate,
  isMobile = false,
  onNotificationClick
}: ProfileDropdownPopupProps) {
  const { isOpen, closeProfileDropdown } = useProfileDropdown();

  if (!isOpen || !currentUser) return null;

  const handleNavigate = (page: string) => {
    closeProfileDropdown();
    onNavigate?.(page);
  };

  const handleNotificationClickInternal = () => {
    closeProfileDropdown();
    onNotificationClick?.();
  };

  const handleLogout = () => {
    closeProfileDropdown();
    console.log('Log out');
    // Add logout logic here
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={closeProfileDropdown}
        />
        
        {/* Dropdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative w-56 bg-popover text-popover-foreground rounded-md border shadow-md"
        >
          <div className="p-1">
            {/* User Info */}
            <div className="flex items-center justify-start gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
                <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm">
                  {currentUser.displayName}
                </p>
                <p className="w-[150px] truncate text-xs text-muted-foreground">
                  @{currentUser.username}
                </p>
              </div>
            </div>
            
            <Separator className="my-1" />
            
            {/* Menu Items */}
            <MenuItem
              icon={<User className="mr-2 h-4 w-4" />}
              label="Profile"
              onClick={() => handleNavigate('profile')}
            />
            <MenuItem
              icon={<BookOpen className="mr-2 h-4 w-4" />}
              label="My Library"
              onClick={() => handleNavigate('library')}
            />
            <MenuItem
              icon={<List className="mr-2 h-4 w-4" />}
              label="My Suggestions"
              onClick={() => handleNavigate('recommendations')}
            />
            
            {/* Mobile-only menu items */}
            {isMobile && (
              <>
                <Separator className="my-1" />
                <MenuItem
                  icon={<Bell className="mr-2 h-4 w-4" />}
                  label="Notifications"
                  onClick={handleNotificationClickInternal}
                  badge={3}
                />
                <MenuItem
                  icon={<MessageSquare className="mr-2 h-4 w-4" />}
                  label="Messages"
                  onClick={() => handleNavigate('chat')}
                  badge={7}
                />
              </>
            )}
            
            <Separator className="my-1" />
            
            <MenuItem
              icon={<Settings className="mr-2 h-4 w-4" />}
              label="Settings"
              onClick={() => handleNavigate('settings')}
            />
            <MenuItem
              icon={<LogOut className="mr-2 h-4 w-4" />}
              label="Log out"
              onClick={handleLogout}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  badge?: number;
}

function MenuItem({ icon, label, onClick, badge }: MenuItemProps) {
  return (
    <div
      onClick={onClick}
      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <Badge className="ml-auto h-5 w-5 flex items-center justify-center text-xs p-0">
          {badge}
        </Badge>
      )}
    </div>
  );
}
