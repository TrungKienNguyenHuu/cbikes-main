import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRoutes from "./routes/products";
import listingsRoutes from "./routes/listings";
import pool from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("PATH:", req.path);
  console.log("URL:", req.url);
  next();
});

app.get("/", (req, res) => {
  res.json({ success: true });
});

// Test database connection
app.get("/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            status: "OK",
            database: "Connected",
            port: PORT,
            timestamp: result.rows[0],
        });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({
            status: "Error",
            database: "Disconnected",
        });
    }
});

// Routes
app.use("/products", productsRoutes);
app.use("/listings", listingsRoutes);

app.get("*", (req, res) => {
  res.json({
    message: "Catch-all route reached",
    path: req.path,
    url: req.url,
    originalUrl: req.originalUrl
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

// Start server
/*app.listen(PORT, () => {
  console.log(`✓ Test Backend Server running on http://localhost:${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log(`✓ Get all products: http://localhost:${PORT}/api/products`);
  console.log(`✓ Get all listings: http://localhost:${PORT}/api/listings`);
});*/


// Graceful shutdown
process.on("SIGINT", async () => {
    console.log("Shutting down...");
    await pool.end();
    process.exit(0);
});

console.log("Health route registered");
console.log("Products router mounted");
console.log("Listings router mounted");

export default app;
