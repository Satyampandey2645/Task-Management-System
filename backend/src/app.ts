import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.use(errorMiddleware);

export default app;
