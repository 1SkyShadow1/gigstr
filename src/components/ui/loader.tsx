import React from 'react';
import { motion } from "framer-motion";

// Modern dual-ring loader inspired by uiverse.io, themed for gigstr
const Loader = () => {
    return (
        <div className="flex items-center justify-center p-8 space-x-2" role="status" aria-live="polite">
            <span className="sr-only">Loading...</span>
            <motion.div
                className="w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                animate={{
                    y: [0, -10, 0],
                    opacity: [1, 0.5, 1],
                }}
                transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0
                }}
            />
            <motion.div
                className="w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                animate={{
                    y: [0, -10, 0],
                    opacity: [1, 0.5, 1],
                }}
                transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.1
                }}
            />
            <motion.div
                className="w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                animate={{
                    y: [0, -10, 0],
                    opacity: [1, 0.5, 1],
                }}
                transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2
                }}
            />
        </div>
    );
};

export default Loader;