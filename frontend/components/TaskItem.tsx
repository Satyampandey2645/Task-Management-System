"use client";
import { motion } from "framer-motion";

export default function TaskItem({ task, onToggle, onDelete, onEdit }: any) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between items-center
      bg-white/10 dark:bg-white/5
      backdrop-blur-md border border-white/10
      p-3 rounded-xl
      hover:shadow-xl hover:scale-[1.02]
      transition-all duration-200"
    >
      <span className={task.completed ? "line-through text-gray-400" : ""}>
        {task.title}
      </span>

      <div className="flex gap-3">
        <button onClick={() => onToggle(task.id)} className="text-green-500">✓</button>
        <button onClick={() => onEdit(task)} className="text-blue-500">✎</button>
        <button onClick={() => onDelete(task.id)} className="text-red-500">✕</button>
      </div>
    </motion.div>
  );
}
