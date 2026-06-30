import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import productsRoutes from "./routes/products";
import listingsRoutes from "./routes/listings";
import clicksRoutes from "./routes/clicks";
import pool from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    const isDev = process.env.NODE_ENV !== "production";
    // Allow if no origin (like Postman), if explicitly allowed, or if in development
    if (!origin || allowedOrigins.includes(origin) || isDev) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Rate limiting (only apply in production or increase limit for local dev)
const isDev = process.env.NODE_ENV !== "production";
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 100, // Limit each IP to 10,000 requests in dev, 100 in prod
  message: "Too many requests from this IP, please try again later."
});
app.use("/", apiLimiter);

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
app.use("/clicks", clicksRoutes);

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
