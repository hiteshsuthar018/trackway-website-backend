"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Enable CORS for all origins (you can restrict if needed)
app.use((0, cors_1.default)());
// Middleware
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Auth routes
app.use("/api/auth", authRoutes_1.default);
// Blog routes
app.use("/api/blogs", blogRoutes_1.default);
// Start server
try {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
}
catch (error) {
    console.error('Failed to start server:', error);
}
