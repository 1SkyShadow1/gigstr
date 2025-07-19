import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";
interface ThemeContextType {
  theme: "light" | "dark";
  themeMode: Theme;
  setThemeMode: (mode: Theme) => void;
  toggle: () => void;
}
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  themeMode: "light",
  setThemeMode: () => {},
  toggle: () => {},
});

function getSystemTheme(): "light" | "dark" {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme");
    return (stored as Theme) || "system";
  });
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
      return getSystemTheme();
    }
    return "light";
  });

  // Listen for system theme changes
  useEffect(() => {
    if (themeMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setTheme(mq.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [themeMode]);

  // Update theme when mode changes
  useEffect(() => {
    if (themeMode === "system") {
      setTheme(getSystemTheme());
    } else {
      setTheme(themeMode);
    }
    localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const setThemeModeSafe = (mode: Theme) => setThemeMode(mode);
  const toggle = () => {
    if (themeMode === "light") setThemeMode("dark");
    else if (themeMode === "dark") setThemeMode("system");
    else setThemeMode("light");
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode: setThemeModeSafe, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 