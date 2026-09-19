import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";

import prisma from "./lib/prisma";
import authRoutes from "./routes/auth.routes";
import artworkRoutes from "./routes/artwork.routes";
import adminArtworkRoutes from "./routes/admin.artwork.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import commissionRoutes from "./routes/commission.routes";

const app = express();

const PORT = Number(process.env.PORT) || 5000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

// Artwork assets are served solely from the repository's images folder.
app.use("/images", express.static(path.resolve(__dirname, "../../images")));

// SECURITY
app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// BODY PARSING
app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

app.use(cookieParser());

// API RATE LIMIT
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// AUTH
app.use("/api/auth", authRoutes);
app.use("/api/artworks", artworkRoutes);
app.use("/api/admin/artworks", adminArtworkRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/commissions", commissionRoutes);

// HEALTH CHECK
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "Kalanvay API is running.",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      success: false,
      message: "API is running but database connection failed.",
      database: "disconnected",
    });
  }
});

// ROOT
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Kalanvay API.",
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ERROR HANDLER
app.use(
  (
    error: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
);

// START
const server = app.listen(PORT, () => {
  console.log(`Kalanvay API running on http://localhost:${PORT}`);
});

// SHUTDOWN
async function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
