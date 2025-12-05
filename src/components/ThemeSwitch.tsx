import React from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

const getSystemPref = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return getSystemPref();
};

export const ThemeSwitch: React.FC<{ className?: string }> = ({ className }) => {
  const [theme, setTheme] = React.useState<Theme>(getInitialTheme);

  React.useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const stored = window.localStorage.getItem('theme');
      if (stored !== 'light' && stored !== 'dark') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // Accessibility: allow keyboard interaction
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
    if (e.key === 'ArrowLeft') setTheme('light');
    if (e.key === 'ArrowRight') setTheme('dark');
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === 'dark'}
      onClick={toggle}
      onKeyDown={onKeyDown}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={
        'relative inline-flex h-8 w-16 items-center rounded-full border border-border ' +
        'bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring ' +
        (className ?? '')
      }
    >
      {/* Background icons */}
      <span className="pointer-events-none absolute left-1 flex h-6 w-6 items-center justify-center text-foreground/60">
        <Sun size={16} />
      </span>
      <span className="pointer-events-none absolute right-1 flex h-6 w-6 items-center justify-center text-foreground/60">
        <Moon size={16} />
      </span>

      {/* Sliding knob */}
      <span
        className={
          'absolute top-1 h-6 w-6 rounded-full shadow ' +
          'transition-transform will-change-transform ' +
          (theme === 'dark'
            ? 'translate-x-8 bg-primary'
            : 'translate-x-0 bg-secondary')
        }
      />
    </button>
  );
};

export default ThemeSwitch;
