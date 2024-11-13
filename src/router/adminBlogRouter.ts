import { Router } from "express";
import adminBlogController from "../controller/adminBlogController";

const adminBlogRouter = Router();

adminBlogRouter.get("/post-blog", adminBlogController.postBlog);

export default adminBlogRouter;
