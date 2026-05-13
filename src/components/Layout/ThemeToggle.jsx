// src/components/Layout/ThemeToggle.jsx
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ darkMode, onToggle }) {
  return (
    <button className="icon-btn" onClick={onToggle} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} aria-label="Toggle dark mode">
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
