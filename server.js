import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "./src/config/env.js";
import connectDB from "./src/config/db.js";
import { routerV1 } from "./src/routes/index.js";
import { errorHandler, notFoundHandler } from "./src/middlewares/error.js";
import { setupSwagger } from "./src/config/swagger.js";

const app = express();

// Connect to database
connectDB();

app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true
  })
);
app.use(helmet());
app.use(morgan(config.LOG_FORMAT));
app.use(express.json({ limit: config.BODY_LIMIT }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

if (config.SWAGGER_ENABLED) {
  setupSwagger(app);
}

app.use("/api/v1", routerV1);

app.get("/health", async (req, res) => {
  try {
    const mongoose = (await import("mongoose")).default;
    if (mongoose.connection.readyState === 1) {
      res.json({ status: "ok" });
    } else {
      res.status(503).json({ status: "degraded" });
    }
  } catch {
    res.status(503).json({ status: "degraded" });
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  process.stdout.write(`Server running on port ${config.PORT}\n`);
});

const shutdown = async (signal) => {
  process.stdout.write(`Received ${signal}, shutting down\n`);
  server.close(async () => {
    const mongoose = (await import("mongoose")).default;
    await mongoose.connection.close();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
