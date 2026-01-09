
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeSwitch = () => {
    const { theme, setThemeMode } = useTheme();

    const toggleTheme = () => {
        setThemeMode(theme === "dark" ? "light" : "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            className={`
        relative inline-flex h-9 w-16 items-center rounded-full px-1 shadow-inner transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${theme === "dark" ? "bg-slate-800" : "bg-sky-200"}
      `}
            aria-label="Toggle Theme"
        >
            <span className="sr-only">Toggle Theme</span>

            {/* Clouds/Stars Background Decorations */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
                <AnimatePresence initial={false}>
                    {theme === "light" && (
                        <motion.div
                            key="clouds"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <span className="absolute top-1 left-2 h-2 w-4 rounded-full bg-white/60 blur-[1px]" />
                            <span className="absolute bottom-2 right-3 h-2 w-5 rounded-full bg-white/50 blur-[1px]" />
                            <span className="absolute top-3 right-5 h-1.5 w-3 rounded-full bg-white/40 blur-[1px]" />
                        </motion.div>
                    )}
                    {theme === "dark" && (
                        <motion.div
                            key="stars"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <span className="absolute top-2 left-3 h-0.5 w-0.5 rounded-full bg-white/80" />
                            <span className="absolute bottom-2 left-5 h-0.5 w-0.5 rounded-full bg-white/60" />
                            <span className="absolute top-3 right-4 h-0.5 w-0.5 rounded-full bg-white/90" />
                            <span className="absolute bottom-3 right-2 h-0.5 w-0.5 rounded-full bg-white/50" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Toggle Circle */}
            <motion.div
                className={`
          flex h-7 w-7 items-center justify-center rounded-full shadow-md z-10
          ${theme === "dark" ? "bg-slate-900 border border-slate-700" : "bg-white border border-sky-100"}
        `}
                animate={{
                    x: theme === "dark" ? 28 : 0,
                    rotate: theme === "dark" ? 0 : 0
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }}
            >
                <div className="relative h-4 w-4">
                    <AnimatePresence mode="wait" initial={false}>
                        {theme === "dark" ? (
                            <motion.div
                                key="moon"
                                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Moon size={14} className="text-slate-200 fill-slate-200" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sun"
                                initial={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Sun size={14} className="text-amber-400 fill-amber-400" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </button>
    );
};

export default ThemeSwitch;