import { Request, Response } from "express";
import { JWT_SECRET } from "../config";
import { prismaClient } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Sign up
const signup = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
console.log(email,password);

if (!email || !password) {
  return res.status(400).json({ message: "Email and password are required." });
}
console.log("hello2")

try {
  // Check if user already exists
  const existingUser = await prismaClient.user.findUnique({
    where: { email: email },
  });
  console.log("hello3")

    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismaClient.user.create({
      data: {
        email: email,
        password: hashedPassword,
        role: role || "user", // default role fallback
      },
    });

    return res.status(201).json({
      userId: newUser.id,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      message: "An error occurred while signing up. Please try again later.",
    });
  }
};

// Sign in
const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required." });
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET as string, {
      expiresIn: "1d",
    });
   console.log(user.blogAccess);
    return res.status(200).json({
      token,
      blogAccess:user.blogAccess,
      message: "Logged in successfully.",
    });
  } catch (error) {
    console.error("Signin Error:", error);
    return res.status(500).json({
      message: "An error occurred while logging in. Please try again later.",
    });
  }
};

export { signup, signin };
