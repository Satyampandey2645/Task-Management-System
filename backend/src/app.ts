import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

// Allow localhost for dev and any Vercel frontend
const allowedOrigins = [
  "http://localhost:3000",
  /\.vercel\.app$/  // regex allows all Vercel deployments
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman or server requests
    const allowed = allowedOrigins.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    if (allowed) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Error handler
app.use(errorMiddleware);

export default app;
