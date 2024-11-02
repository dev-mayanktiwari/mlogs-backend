import { Router } from "express";
import blogController from "../controller/blogController";

const blogRouter = Router();

blogRouter.get("/fetch-blogs", blogController.fetchBlogs);
blogRouter.post("/:blogId/like", blogController.like);

// Liking a blog
// Commenting on a blog
// Saving a blog
// Getting a blog
// unliking a blog
// Uncommenting a blog
// getting total likes
// getting total comments


export default blogRouter;
