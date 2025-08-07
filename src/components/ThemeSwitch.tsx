
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import '@/components/ui/switch.css';

const ThemeSwitch: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme();
  const isDark = themeMode === 'dark';
  return (
    <label className="ui-switch" title="Toggle light/dark mode">
      <input
        type="checkbox"
        checked={isDark}
        onChange={() => setThemeMode(isDark ? 'light' : 'dark')}
        aria-label="Toggle dark mode"
      />
      <div className="slider">
        <div className="circle"></div>
      </div>
    </label>
  );
};

export default ThemeSwitch;