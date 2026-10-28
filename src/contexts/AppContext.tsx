'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  CURRENT_USER,
  DEMO_APPLICATIONS,
  DEMO_NOTIFICATIONS,
  INSTITUTIONS,
  type User,
  type Application,
  type Notification,
  type Institution,
} from '@/lib/data';

interface AppContextValue {
  user: User;
  currentInstitution: Institution;
  setCurrentInstitution: (inst: Institution) => void;
  applications: Application[];
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  getApplication: (id: string) => Application | undefined;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;
  searchOpen: boolean;
  toggleSearch: () => void;
  notificationsOpen: boolean;
  toggleNotifications: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User>(CURRENT_USER);
  const [currentInstitution, setCurrentInstitution] = useState<Institution>(INSTITUTIONS[0]);
  const [applications, setApplications] = useState<Application[]>(DEMO_APPLICATIONS);
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const addApplication = useCallback((app: Application) => {
    setApplications(prev => [app, ...prev]);
  }, []);

  const updateApplication = useCallback((id: string, updates: Partial<Application>) => {
    setApplications(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updates } : a))
    );
  }, []);

  const getApplication = useCallback(
    (id: string) => applications.find(a => a.id === id),
    [applications]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleSearch = useCallback(() => {
    setSearchOpen(prev => !prev);
  }, []);

  const toggleNotifications = useCallback(() => {
    setNotificationsOpen(prev => !prev);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        currentInstitution,
        setCurrentInstitution,
        applications,
        addApplication,
        updateApplication,
        getApplication,
        notifications,
        markNotificationRead,
        unreadCount,
        searchOpen,
        toggleSearch,
        notificationsOpen,
        toggleNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
