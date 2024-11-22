import { Router } from "express";
import blogFetchController from "../controller/blogFetchController";

const fetchBlogRouter = Router();

fetchBlogRouter.get("/blogs", blogFetchController.fetchBlogs);
fetchBlogRouter.get("/:blogId/blog", blogFetchController.getBlog);

export default fetchBlogRouter;
