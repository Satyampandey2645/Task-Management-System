import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email },
    });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(401).json({ message: "Refresh token required" });

    const payload: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    );

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });

    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const payload: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    );

    await prisma.user.update({
      where: { id: payload.id },
      data: { refreshToken: null },
    });

    res.json({ message: "Logged out successfully" });
  } catch {
    res.status(500).json({ message: "Logout failed" });
  }
};
