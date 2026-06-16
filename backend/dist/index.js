"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
// Use the port from environment variables, or default to 5001
const PORT = process.env.PORT || 5001;
// Start the server
app_1.default.listen(PORT, () => {
    console.log(`\n🏍️  Local Backend Server is running!`);
    console.log(`----------------------------------------`);
    console.log(`✓ Base URL: http://localhost:${PORT}`);
    console.log(`✓ Health check: http://localhost:${PORT}/health`);
    console.log(`✓ Get all products: http://localhost:${PORT}/products`);
    console.log(`✓ Get all listings: http://localhost:${PORT}/listings`);
    console.log(`----------------------------------------\n`);
    console.log("Press Ctrl+C to stop.");
});
//# sourceMappingURL=index.js.map