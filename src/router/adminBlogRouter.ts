import { Router } from "express";
import adminBlogController from "../controller/adminBlogController";

const adminBlogRouter = Router();

adminBlogRouter.post("/post-blog", adminBlogController.postBlog);
adminBlogRouter.put("/update-blog/:postId", adminBlogController.updateBlog);
adminBlogRouter.delete("/delete-blog/:postId", adminBlogController.deleteBlog);

export default adminBlogRouter;
