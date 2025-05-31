"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogById = exports.getAllBlogs = exports.grantBlogAccess = exports.deleteBlog = exports.updateBlog = exports.postBlog = void 0;
const db_1 = require("../db");
// Create a blog (blogAccess user only)
const postBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const userId = req.userId;
        console.log(title, description, "----->", userId, "\n");
        const user = yield db_1.prismaClient.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.blogAccess) {
            return res.status(403).json({ message: "You don't have access to post blogs" });
        }
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        console.log(imagePath);
        const newPost = yield db_1.prismaClient.post.create({
            data: {
                title,
                description,
                image: imagePath || undefined,
                authorId: userId,
            },
        });
        res.status(201).json(newPost);
    }
    catch (error) {
        console.error("Post Blog Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.postBlog = postBlog;
// Update a blog (blogAccess user only)
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = parseInt(req.params.id);
        const { title, description, image } = req.body;
        const userId = req.userId;
        const user = yield db_1.prismaClient.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can update blogs" });
        }
        const existingPost = yield db_1.prismaClient.post.findUnique({
            where: { id: postId },
        });
        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        const updatedPost = yield db_1.prismaClient.post.update({
            where: { id: postId },
            data: {
                title,
                description,
                image,
            },
        });
        res.json(updatedPost);
    }
    catch (error) {
        console.error("Update Blog Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.updateBlog = updateBlog;
// Delete a blog (blogAccess user only)
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.userId;
        const user = yield db_1.prismaClient.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can delete blogs" });
        }
        const existingPost = yield db_1.prismaClient.post.findUnique({
            where: { id: postId },
        });
        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        yield db_1.prismaClient.post.delete({
            where: { id: postId },
        });
        res.json({ message: "Post deleted successfully" });
    }
    catch (error) {
        console.error("Delete Blog Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.deleteBlog = deleteBlog;
//function to grant the access for uploading the blog
const grantBlogAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userIds } = req.body; // array of user IDs
        const adminId = req.userId;
        const admin = yield db_1.prismaClient.user.findUnique({ where: { id: adminId } });
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Only admins can grant blog access" });
        }
        yield db_1.prismaClient.user.updateMany({
            where: { id: { in: userIds } },
            data: { blogAccess: true },
        });
        res.json({ message: "Blog access granted successfully." });
    }
    catch (error) {
        console.error("Grant Access Error:", error);
        res.status(500).json({ message: "Failed to grant access" });
    }
});
exports.grantBlogAccess = grantBlogAccess;
//function to get all the blogs
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield db_1.prismaClient.post.findMany({
            orderBy: { date: "desc" },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        res.status(200).json(posts);
    }
    catch (error) {
        console.error("Get All Blogs Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getAllBlogs = getAllBlogs;
//function to get a single blog
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid blog ID" });
    }
    try {
        const post = yield db_1.prismaClient.post.findUnique({
            where: { id: postId },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        if (!post) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error("Get Blog By ID Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getBlogById = getBlogById;
