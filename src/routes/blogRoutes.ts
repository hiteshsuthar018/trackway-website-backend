import express from "express";
import { postBlog, updateBlog, deleteBlog, grantBlogAccess, getAllBlogs, getBlogById } from "../controllers/blogController";
import { upload } from "../middlewares/multer";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

//@ts-ignore
router.post("/create", authenticate, upload.single("image"), postBlog);
//@ts-ignore
router.put("/:id", authenticate, updateBlog);
//@ts-ignore
router.delete("/:id", authenticate, deleteBlog);
//@ts-ignore
router.post("/grant-access", authenticate, grantBlogAccess); // admin-only
//@ts-ignore
router.get("/get-blogs", getAllBlogs); 
//@ts-ignore
router.get("/get-blog/:id",getBlogById); 

export default router;
