import { Router } from "express";
import blogController from "../controller/blogController";

const blogRouter = Router();

blogRouter.get("/fetch-blogs", blogController.fetchBlogs);
// blogRouter.post("/like-blog", blogController.like);
// Fetching Blogs List (by id also/ name / title also && category also)
// Liking a blog
// Commenting on a blog
// Saving a blog
// Getting a blog

export default blogRouter;
