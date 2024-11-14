import { Router } from "express";
import blogController from "../controller/blogController";

const blogRouter = Router();

blogRouter.get("/fetch-blogs", blogController.fetchBlogs);
blogRouter.post("/:blogId/like", blogController.like);
blogRouter.delete("/:blogId/unlike", blogController.unlike);
blogRouter.get("/:blogId/total-likes", blogController.totalLikes);
blogRouter.post("/:blogId/comment", blogController.comment);
blogRouter.delete("/:commentId/uncomment", blogController.uncomment);
blogRouter.get("/:blogId/total-comments", blogController.getTotalComments);
blogRouter.get("/:blogId/fetch-comments", blogController.fetchComments);
blogRouter.put("/:commentId/edit-comment", blogController.editComment);
blogRouter.post("/:blogId/save", blogController.save);
blogRouter.delete("/:blogId/unsave", blogController.unsave);
blogRouter.get("/:blogId/total-saves", blogController.totalSaves);
blogRouter.get("/:blogId/blog", blogController.getBlog);

// Liking a blog
// Commenting on a blog
// Saving a blog
// Getting a blog
// unliking a blog
// Uncommenting a blog
// getting total likes
// getting total comments

export default blogRouter;
