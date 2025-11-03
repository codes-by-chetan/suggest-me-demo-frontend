import { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationsContextType {
  isOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
  toggleNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openNotifications = () => setIsOpen(true);
  const closeNotifications = () => setIsOpen(false);
  const toggleNotifications = () => setIsOpen(prev => !prev);

  return (
    <NotificationsContext.Provider
      value={{
        isOpen,
        openNotifications,
        closeNotifications,
        toggleNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
