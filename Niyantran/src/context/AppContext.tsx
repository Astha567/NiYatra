import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, UserRole } from '../types/schema';

export type FontPairing = 'serif' | 'technical' | 'modern';

export interface AppContextType {
  user: UserSession | null;
  login: (role: UserRole, division: string, corridor: string, name?: string, title?: string) => void;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  fontPairing: FontPairing;
  setFontPairing: (pairing: FontPairing) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  toggleNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Saved user session
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('niyatra_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Theme state: default 'light'
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('niyatra_theme');
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
  });

  // Font pairing state: default 'serif'
  const [fontPairing, setFontPairingState] = useState<FontPairing>(() => {
    const savedFont = localStorage.getItem('niyatra_font_pairing');
    return (savedFont === 'technical' || savedFont === 'modern' || savedFont === 'serif')
      ? savedFont
      : 'serif';
  });

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => {
    return localStorage.getItem('niyatra_sidebar_collapsed') === 'true';
  });

  const [sidebarWidth, setSidebarWidth] = useState<number>(260);

  // Notifications slide-over panel
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  // Apply theme to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('niyatra_theme', theme);
  }, [theme]);

  // Apply font pairing to <html> attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-font-pairing', fontPairing);
    localStorage.setItem('niyatra_font_pairing', fontPairing);
  }, [fontPairing]);

  // Save sidebar collapsed state
  useEffect(() => {
    localStorage.setItem('niyatra_sidebar_collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const login = (role: UserRole, division: string, corridor: string, name?: string, title?: string) => {
    const defaultNames: Record<UserRole, { name: string; title: string }> = {
      section_engineer: { name: 'Rajesh Sharma', title: 'Senior Section Engineer (Track)' },
      controller: { name: 'Ananya Roy', title: 'Chief Power Controller' },
      drm: { name: 'V. K. Agarwal', title: 'Divisional Railway Manager' },
    };

    const session: UserSession = {
      role,
      division: division || 'Howrah Division (HWH)',
      corridor: corridor || 'HWH-BDC (Howrah - Bandel Main line)',
      name: name || defaultNames[role].name,
      title: title || defaultNames[role].title,
    };
    setUser(session);
    localStorage.setItem('niyatra_user_session', JSON.stringify(session));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('niyatra_user_session');
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setFontPairing = (pairing: FontPairing) => {
    setFontPairingState(pairing);
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
  };

  const toggleSidebar = () => {
    setSidebarCollapsedState(prev => !prev);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        theme,
        toggleTheme,
        fontPairing,
        setFontPairing,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        sidebarWidth,
        setSidebarWidth,
        notificationsOpen,
        setNotificationsOpen,
        toggleNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
