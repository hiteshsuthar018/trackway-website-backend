"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controllers/blogController");
const multer_1 = require("../middlewares/multer");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
//@ts-ignore
router.post("/create", authMiddleware_1.authenticate, multer_1.upload.single("image"), blogController_1.postBlog);
//@ts-ignore
router.put("/:id", authMiddleware_1.authenticate, blogController_1.updateBlog);
//@ts-ignore
router.delete("/:id", authMiddleware_1.authenticate, blogController_1.deleteBlog);
//@ts-ignore
router.post("/grant-access", authMiddleware_1.authenticate, blogController_1.grantBlogAccess); // admin-only
//@ts-ignore
router.get("/get-blogs", blogController_1.getAllBlogs);
//@ts-ignore
router.get("/get-blog/:id", blogController_1.getBlogById);
exports.default = router;
