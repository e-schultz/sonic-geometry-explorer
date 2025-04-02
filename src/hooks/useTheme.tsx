
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Check if window is defined (to handle SSR)
  const isBrowser = typeof window !== 'undefined';
  
  // Get system preference
  const getSystemTheme = (): Theme => {
    if (!isBrowser) return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  
  // Get saved theme from localStorage or use system preference
  const getSavedTheme = (): Theme => {
    if (!isBrowser) return 'dark';
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return savedTheme || getSystemTheme();
  };
  
  const [theme, setTheme] = useState<Theme>(getSavedTheme());
  
  // Effect to add/remove dark class and save to localStorage
  useEffect(() => {
    if (!isBrowser) return;
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Add or remove class from document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, isBrowser]);
  
  // Effect to listen for system preference changes
  useEffect(() => {
    if (!isBrowser) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Only update if the user hasn't explicitly chosen a theme
      if (!localStorage.getItem('theme')) {
        setTheme(getSystemTheme());
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isBrowser]);
  
  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  
  return { theme, setTheme, toggleTheme };
}
