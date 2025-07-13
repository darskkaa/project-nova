'use client';

import { useTheme } from './ThemeProvider';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme, isMounted } = useTheme();
  
  if (!isMounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-dark-700/50 animate-pulse"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-dark-800/50 hover:bg-dark-700/50 transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
          className="block w-6 h-6"
        >
          {theme === 'dark' ? (
            <SunIcon className="w-full h-full text-yellow-400" />
          ) : (
            <MoonIcon className="w-full h-full text-indigo-500" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
