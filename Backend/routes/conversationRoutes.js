import express from "express";
import ConversationController from "../controllers/conversationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/check-mobile-number", authMiddleware, ConversationController.checkMobileNumber);
router.get("/", authMiddleware, ConversationController.getConversations);

export default router;