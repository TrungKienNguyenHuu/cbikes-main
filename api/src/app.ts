import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRoutes from "./routes/products";
import listingsRoutes from "./routes/listings";
import { initializeDatabase } from "./config/initDB";
import pool from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
app.use(async (req, res, next) => {
    if (!app.locals.dbInitialized) {
        try {
            await initializeDatabase();
            app.locals.dbInitialized = true;
        } catch (error) {
            console.error("Failed to initialize database:", error);
        }
    }
    next();
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

export default app;
