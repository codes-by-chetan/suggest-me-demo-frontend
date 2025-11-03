import { NotificationsPopup } from './NotificationsPopup';
import { ProfileDropdownPopup } from './ProfileDropdownPopup';
import { useNotifications } from '../contexts/NotificationsContext';

interface GlobalPopupsProps {
  currentUser: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  users: any[];
  content: any[];
  isMobile: boolean;
  onNavigate: (page: string) => void;
  onNotificationClick: () => void;
}

export function GlobalPopups({
  currentUser,
  users,
  content,
  isMobile,
  onNavigate,
  onNotificationClick,
}: GlobalPopupsProps) {
  const { isOpen: isNotificationsOpen, closeNotifications } = useNotifications();

  return (
    <>
      {/* Global Notifications Popup */}
      <NotificationsPopup
        users={users}
        content={content}
        currentUserId={currentUser.id}
        onViewAll={() => {
          closeNotifications();
          onNavigate('notifications');
        }}
        onClose={closeNotifications}
        isOpen={isNotificationsOpen}
      />
      
      {/* Global Profile Dropdown Popup */}
      <ProfileDropdownPopup
        currentUser={currentUser}
        onNavigate={onNavigate}
        isMobile={isMobile}
        onNotificationClick={onNotificationClick}
      />
    </>
  );
}
