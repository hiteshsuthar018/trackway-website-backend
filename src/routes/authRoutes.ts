import { Router } from "express";
import { signup, signin } from "../controllers/authController";

const router = Router();

// User registration
//@ts-ignore
router.post("/signup", signup);

// User login
//@ts-ignore
router.post("/signin", signin);

export default router;
