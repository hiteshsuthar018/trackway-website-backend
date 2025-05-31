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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const config_1 = require("../config");
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Sign up
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    console.log(email, password);
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }
    console.log("hello2");
    try {
        // Check if user already exists
        const existingUser = yield db_1.prismaClient.user.findUnique({
            where: { email: email },
        });
        console.log("hello3");
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email." });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield db_1.prismaClient.user.create({
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
    }
    catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            message: "An error occurred while signing up. Please try again later.",
        });
    }
});
exports.signup = signup;
// Sign in
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "email and password are required." });
    }
    try {
        const user = yield db_1.prismaClient.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.JWT_SECRET, {
            expiresIn: "1d",
        });
        console.log(user.blogAccess);
        return res.status(200).json({
            token,
            blogAccess: user.blogAccess,
            message: "Logged in successfully.",
        });
    }
    catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({
            message: "An error occurred while logging in. Please try again later.",
        });
    }
});
exports.signin = signin;
