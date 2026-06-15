import app from "./app";

// Use the port from environment variables, or default to 5001
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
    console.log(`\n🏍️  Local Backend Server is running!`);
    console.log(`----------------------------------------`);
    console.log(`✓ Base URL: http://localhost:${PORT}`);
    console.log(`✓ Health check: http://localhost:${PORT}/health`);
    console.log(`✓ Get all products: http://localhost:${PORT}/products`);
    console.log(`✓ Get all listings: http://localhost:${PORT}/listings`);
    console.log(`----------------------------------------\n`);
    console.log("Press Ctrl+C to stop.");
});