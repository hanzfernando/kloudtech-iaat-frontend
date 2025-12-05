import React from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const getSystemPref = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const applyTheme = (effective: 'light' | 'dark'): void => {
  const root = document.documentElement;
  if (effective === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored as Theme;
  return 'system';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = React.useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>(
    theme === 'system' ? getSystemPref() : (theme as 'light' | 'dark')
  );

  // Apply theme whenever the resolved/effective theme changes
  React.useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  // Persist explicit theme choice
  React.useEffect(() => {
    try {
      window.localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  // Recalculate resolvedTheme when theme or system preference changes
  React.useEffect(() => {
    const calc = () => {
      setResolvedTheme(theme === 'system' ? getSystemPref() : (theme as 'light' | 'dark'));
    };
    calc();

    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
        if (theme === 'system') calc();
      };
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }
  }, [theme]);

  const toggle = () => {
    // Toggle effective theme only for light/dark; keep system as system
    if (theme === 'system') {
      // If on system, toggling will set the opposite of current resolved theme explicitly
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggle,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default ThemeProvider;
