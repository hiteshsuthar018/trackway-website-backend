import { Request, Response } from "express";
import { prismaClient } from "../db";
import path from "path";
// Create a blog (blogAccess user only)
export const postBlog = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;
     console.log(title,description,"----->",userId,"\n");
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.blogAccess) {
      return res.status(403).json({ message: "You don't have access to post blogs" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
     console.log(imagePath);
    const newPost = await prismaClient.post.create({
      data: {
        title,
        description,
        image: imagePath || undefined,
        authorId: userId,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Post Blog Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update a blog (blogAccess user only)
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const { title, description, image } = req.body;
    const userId = req.userId;

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update blogs" });
    }

    const existingPost = await prismaClient.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedPost = await prismaClient.post.update({
      where: { id: postId },
      data: {
        title,
        description,
        image,
      },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error("Update Blog Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Delete a blog (blogAccess user only)
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.userId;

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete blogs" });
    }

    const existingPost = await prismaClient.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    await prismaClient.post.delete({
      where: { id: postId },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//function to grant the access for uploading the blog
export const grantBlogAccess = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body; // array of user IDs
    const adminId = req.userId;

    const admin = await prismaClient.user.findUnique({ where: { id: adminId } });

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Only admins can grant blog access" });
    }

    await prismaClient.user.updateMany({
      where: { id: { in: userIds } },
      data: { blogAccess: true },
    });

    res.json({ message: "Blog access granted successfully." });
  } catch (error) {
    console.error("Grant Access Error:", error);
    res.status(500).json({ message: "Failed to grant access" });
  }
};

//function to get all the blogs
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const posts = await prismaClient.post.findMany({
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
  } catch (error) {
    console.error("Get All Blogs Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//function to get a single blog
export const getBlogById = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);

  if (isNaN(postId)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  try {
    const post = await prismaClient.post.findUnique({
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
  } catch (error) {
    console.error("Get Blog By ID Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

