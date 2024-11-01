import { Router } from "express";
import authController from "../controller/userAuthController";
import authMiddleware from "../middleware/authentication";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.put("/confirmation/:token", authController.confirmation);
authRouter.post("/login", authController.login);
authRouter.get("/self-identification", authMiddleware, authController.selfIdentification);
authRouter.put("/logout", authMiddleware, authController.logout);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.put("/forgot-password", authController.forgotPassword);
authRouter.put("/reset-password/:token", authController.resetPassword);
authRouter.put("/change-password", authMiddleware, authController.changePassword);

export default authRouter;
