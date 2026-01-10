"use client";

export default function TaskForm({ title, setTitle, onSubmit }: any) {
  return (
    <div className="flex gap-2">
      <input
        className="border border-white/10 bg-transparent p-2 flex-1 rounded
        focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
        placeholder="New task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={onSubmit}
        className="bg-blue-600 text-white px-4 rounded
        hover:scale-105 transition-transform"
      >
        {title ? "Save" : "Add"}
      </button>
    </div>
  );
}
