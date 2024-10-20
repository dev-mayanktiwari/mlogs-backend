import { Router } from "express";
import authController from "../controller/auth.controller";
const router = Router();

router.post("/register", authController.register);
router.put("/confirmation/:token", authController.confirmation)

export default router;
