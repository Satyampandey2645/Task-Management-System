"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message, onClear }: { message: string, onClear: () => void }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClear();
    }, 2500);

    return () => clearTimeout(timer);
  }, [message, onClear]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-5 right-5 
          bg-gradient-to-r from-green-500 to-emerald-600
          text-white px-4 py-2 rounded-lg shadow-xl z-50"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
