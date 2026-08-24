import { createContext, useState, useEffect, createElement, ReactNode } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: true,
  toggleTheme: () => {}
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('taskflow-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('taskflow-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return createElement(
    ThemeContext.Provider,
    { value: { darkMode, toggleTheme } },
    children
  );
}
