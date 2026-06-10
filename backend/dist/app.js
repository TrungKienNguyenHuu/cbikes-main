"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const products_1 = __importDefault(require("./routes/products"));
const listings_1 = __importDefault(require("./routes/listings"));
const database_1 = __importDefault(require("./config/database"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log("PATH:", req.path);
    console.log("URL:", req.url);
    next();
});
app.get("/test", (req, res) => {
    res.json({ success: true });
});
// Test database connection
app.get("/health", async (req, res) => {
    try {
        const result = await database_1.default.query("SELECT NOW()");
        res.json({
            status: "OK",
            database: "Connected",
            port: PORT,
            timestamp: result.rows[0],
        });
    }
    catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({
            status: "Error",
            database: "Disconnected",
        });
    }
});
// Routes
app.use("/products", products_1.default);
app.use("/listings", listings_1.default);
app.get("*", (req, res) => {
    res.json({
        message: "Catch-all route reached",
        path: req.path,
        url: req.url,
        originalUrl: req.originalUrl
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
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
    await database_1.default.end();
    process.exit(0);
});
console.log("Health route registered");
console.log("Products router mounted");
console.log("Listings router mounted");
exports.default = app;
//# sourceMappingURL=app.js.map