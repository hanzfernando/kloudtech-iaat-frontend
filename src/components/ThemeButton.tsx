import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';

export const ThemeButton: React.FC<{ className?: string }> = ({ className }) => {
  const { resolvedTheme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={
        'inline-flex items-center gap-2 px-3 py-3 transition ' +
        'hover:opacity-90 ' +
        (className ?? '')
      }
    >
      {resolvedTheme === 'dark' ? (
        <Sun size={20} aria-hidden />
      ) : (
        <Moon size={20} aria-hidden />
      )}
    </button>
  );
};

export default ThemeButton;
