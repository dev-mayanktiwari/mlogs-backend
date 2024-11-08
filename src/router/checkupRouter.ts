import { Router } from "express";
import checkupController from "../controller/checkupController";

const checkupRouter = Router();

checkupRouter.get("/self", checkupController.self);
checkupRouter.get("/health", checkupController.health);

export default checkupRouter;
