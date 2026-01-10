import { Response } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search = "", completed } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user.id,
        title: {
          contains: String(search),
        },
        ...(completed !== undefined && {
          completed: completed === "true",
        }),
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    const task = await prisma.task.create({ data: { title, userId: req.user.id } });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const task = await prisma.task.updateMany({
      where: { id: Number(id), userId: req.user.id },
      data: { title, completed },
    });

    if (!task.count)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task updated" });
  } catch {
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.deleteMany({
      where: { id: Number(id), userId: req.user.id },
    });

    if (task.count === 0) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findFirst({ where: { id: Number(id), userId: req.user.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { completed: !task.completed },
    });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle task" });
  }
};
