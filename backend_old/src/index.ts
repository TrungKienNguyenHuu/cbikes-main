import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bikesRoutes from "./routes/bikes";
import pool from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "OK", database: "Connected", timestamp: result.rows[0] });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ status: "Error", database: "Disconnected" });
  }
});

// Routes
app.use("/api/bikes", bikesRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log(`✓ Get all bikes: http://localhost:${PORT}/api/bikes`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await pool.end();
  process.exit(0);
});
