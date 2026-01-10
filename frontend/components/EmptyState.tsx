"use client";
import { motion } from "framer-motion";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-gray-400 py-10"
    >
      <p className="text-lg">No tasks found 📝</p>
      <p className="text-sm">Add a task to get started</p>
    </motion.div>
  );
}

