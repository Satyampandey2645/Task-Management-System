"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import { logout } from "@/lib/auth";

import TaskItem from "@/components/TaskItem";
import TaskForm from "@/components/TaskForm";
import Toast from "@/components/Toast";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import Sidebar from "@/components/Sidebar";
import StatsChart from "@/components/StatsChart";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [editTask, setEditTask] = useState<any>(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks", {
        params: { search, completed: filter },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, [search, filter]);

  const completed = tasks.filter(t => t.completed).length;

  const saveTask = async () => {
    if (!title.trim()) return;
    try {
      if (editTask) {
        await api.patch(`/tasks/${editTask.id}`, { title });
        setToast("Task updated");
      } else {
        await api.post("/tasks", { title });
        setToast("Task added");
      }
    } catch (err) {
      console.error(err);
    }
    setTitle("");
    setEditTask(null);
    loadTasks();
  };

  const toggleTask = async (id: number) => {
    try {
      await api.patch(`/tasks/${id}/toggle`);
      setToast("Task status updated");
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      setToast("Task deleted");
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTasks((items) => {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 md:max-w-2xl mx-auto mt-4 md:mt-0">
        <Toast message={toast} onClear={() => setToast("")} />

        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">My Tasks</h1>
          <button onClick={logout} className="text-red-500">Logout</button>
        </div>

        <StatsChart total={tasks.length} completed={completed} />

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-2 my-4">
          <input
            placeholder="Search tasks..."
            className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Completed</option>
            <option value="false">Pending</option>
          </select>
        </div>

        <TaskForm title={title} setTitle={setTitle} onSubmit={saveTask} />

        {loading && <Loader />}
        {!loading && tasks.length === 0 && <EmptyState />}

        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={tasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <motion.div layout className="mt-4 space-y-2">
              <AnimatePresence>
                {tasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={(t: any) => {
                      setEditTask(t);
                      setTitle(t.title);
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </SortableContext>
        </DndContext>
      </main>
    </div>
  );
}
