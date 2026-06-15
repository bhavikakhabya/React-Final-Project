import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cf_theme') || 'light';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    localStorage.setItem('cf_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const toggleSidebar = () => setSidebarCollapsed(c => !c);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, sidebarCollapsed, toggleSidebar }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
