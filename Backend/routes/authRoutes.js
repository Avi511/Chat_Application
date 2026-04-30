import express from "express";
import AuthController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", upload.single("profilePicture"), AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", authMiddleware, AuthController.me);
router.post("/logout", authMiddleware, AuthController.logout);
router.put("/update-profile", authMiddleware, upload.single("profilePicture"), AuthController.updateProfile);

export default router;