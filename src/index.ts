import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import blogRoutes from "./routes/blogRoutes";
import path from "path";

const app = express();

// Enable CORS for all origins (you can restrict if needed)
app.use(cors());

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Auth routes
app.use("/api/auth", authRoutes);

// Blog routes
app.use("/api/blogs", blogRoutes);

// Start server
try {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
} catch (error) {
  console.error('Failed to start server:', error);
}
