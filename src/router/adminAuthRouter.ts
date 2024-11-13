import { Router } from "express";
import adminAuthController from "../controller/adminAuthController";

const adminAuthRouter = Router();

adminAuthRouter.route("/login").post(adminAuthController.login);
adminAuthRouter.route("/logout").put(adminAuthController.logout);

export default adminAuthRouter;
