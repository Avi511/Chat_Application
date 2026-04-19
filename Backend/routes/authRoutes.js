import express from "express";
import AuthController from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", authMiddleware, AuthController.getMe);
router.post("/logout", authMiddleware, AuthController.logout);

export default router;