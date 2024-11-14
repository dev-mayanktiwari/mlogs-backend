import { Router } from "express";
import adminBlogController from "../controller/adminBlogController";

const adminBlogRouter = Router();

adminBlogRouter.get("/post-blog", adminBlogController.postBlog);
adminBlogRouter.get("/update-blog/:postId", adminBlogController.updateBlog);

export default adminBlogRouter;
