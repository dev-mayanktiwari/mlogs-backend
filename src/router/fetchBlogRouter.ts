import { Router } from "express";
import blogFetchController from "../controller/blogFetchController";

const fetchBlogRouter = Router();

fetchBlogRouter.get("/blogs", blogFetchController.fetchBlogs);
fetchBlogRouter.get("/:blogId/blog", blogFetchController.getBlog);
fetchBlogRouter.get("/:blogId/comments", blogFetchController.getComments);
fetchBlogRouter.put("/logout", blogFetchController.logout);
fetchBlogRouter.get("/get-guestbook", blogFetchController.getGuestbook);

export default fetchBlogRouter;
