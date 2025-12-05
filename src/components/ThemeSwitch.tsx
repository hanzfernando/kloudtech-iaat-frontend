import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';

export const ThemeSwitch: React.FC<{ className?: string }> = ({ className }) => {
  const { resolvedTheme, setTheme, toggle } = useTheme();

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
      aria-checked={resolvedTheme === 'dark'}
      onClick={toggle}
      onKeyDown={onKeyDown}
      aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
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
          (resolvedTheme === 'dark'
            ? 'translate-x-8 bg-primary'
            : 'translate-x-0 bg-secondary')
        }
      />
    </button>
  );
};

export default ThemeSwitch;
