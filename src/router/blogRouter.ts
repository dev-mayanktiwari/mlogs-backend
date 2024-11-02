import { Router } from "express";
import blogController from "../controller/blogController";

const blogRouter = Router();

blogRouter.get("/fetch-blogs", blogController.fetchBlogs);
blogRouter.put("/:blogId/like", blogController.like);
blogRouter.put("/:blogId/unlike", blogController.unlike)
// Liking a blog
// Commenting on a blog
// Saving a blog
// Getting a blog
// unliking a blog
// Uncommenting a blog
// getting total likes
// getting total comments


export default blogRouter;
