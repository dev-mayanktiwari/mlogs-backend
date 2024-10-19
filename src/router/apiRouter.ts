import { Router } from "express";
import authRouter from "../controller/auth.controller";
const router = Router();

router.post("/register", authRouter.register);

export default router;
