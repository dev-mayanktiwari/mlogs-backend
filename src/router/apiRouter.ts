import { Router } from "express";
import authController from "../controller/auth.controller";
import authMiddleware from "../middleware/authentication";

const router = Router();

router.post("/register", authController.register);
router.put("/confirmation/:token", authController.confirmation);
router.post("/login", authController.login);
router.get("/self-identification", authMiddleware, authController.selfIdentification);
router.put("/logout", authMiddleware, authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.put("/forgot-password", authController.forgotPassword);
router.put("/reset-password/:token", authController.resetPassword);

export default router;
