import { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileDropdownContextType {
  isOpen: boolean;
  openProfileDropdown: () => void;
  closeProfileDropdown: () => void;
  toggleProfileDropdown: () => void;
}

const ProfileDropdownContext = createContext<ProfileDropdownContextType | undefined>(undefined);

export function ProfileDropdownProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openProfileDropdown = () => setIsOpen(true);
  const closeProfileDropdown = () => setIsOpen(false);
  const toggleProfileDropdown = () => setIsOpen(prev => !prev);

  return (
    <ProfileDropdownContext.Provider
      value={{
        isOpen,
        openProfileDropdown,
        closeProfileDropdown,
        toggleProfileDropdown,
      }}
    >
      {children}
    </ProfileDropdownContext.Provider>
  );
}

export function useProfileDropdown() {
  const context = useContext(ProfileDropdownContext);
  if (context === undefined) {
    throw new Error('useProfileDropdown must be used within a ProfileDropdownProvider');
  }
  return context;
}
