"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { logout } from "@/lib/auth";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  const sidebarLinks = (
    <nav className="flex flex-col gap-3">
      <Link href="/dashboard" className="sidebar-link">📊 Dashboard</Link>
      <Link href="/dashboard/tasks" className="sidebar-link">✅ My Tasks</Link>
      <Link href="/dashboard/completed" className="sidebar-link">✔ Completed</Link>
      <Link href="/dashboard/settings" className="sidebar-link">⚙ Settings</Link>
      <button
        onClick={logout}
        className="sidebar-link text-red-400 hover:text-red-500"
      >
        🚪 Logout
      </button>
    </nav>
  );

  return (
    <>
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-900 text-white">
        <h2 className="text-xl font-bold">Task Manager</h2>
        <button onClick={toggleMenu}>
          {open ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-5 z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <h2 className="text-2xl font-bold mb-8 hidden md:block">Task Manager</h2>
        {sidebarLinks}
        <div className="mt-10">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
