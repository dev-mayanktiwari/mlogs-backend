import { NextFunction, Request, Response } from "express";
import httpResponse from "../utils/httpResponse";
import { EErrorStatusCode, EResponseStatusCode } from "../constant/application";
import httpError from "../utils/httpError";
import { postBlogSchema } from "../types/blogTypes";
import adminBlogServices from "../services/adminBlogDbServices";
import adminBlogDbServices from "../services/adminBlogDbServices";
import { Category, Post } from "@prisma/client";
import { sendBlogPostEmail } from "../services/sendEmailService";
import { EResponseMessage } from "../constant/responseMessage";

interface IPostBlog extends Request {
  body: {
    title: string;
    content: string;
    headline: string;
    category: string[];
  };
}

export default {
  postBlog: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate Blog body
      const { body } = req as IPostBlog;
      const parsed = postBlogSchema.safeParse(body);

      if (!parsed.success) {
        const errorMessage = parsed.error?.issues.map((issue) => issue.message).join(", ");
        return httpError(next, new Error(errorMessage || "Invalid inputs"), req, EErrorStatusCode.BAD_REQUEST);
      }

      // Create the category
      const categories: Category[] = await adminBlogDbServices.createCategory(parsed.data.category);

      // Create the blog
      const blog: Post = await adminBlogDbServices.createBlog(parsed.data.title, parsed.data.content, parsed.data.headline);

      // Connect the blog with the category
      const connectedBlog = await adminBlogDbServices.connectBlogWithCategory(blog.postId, categories);

      // Send email to the users
      const userEmails = await adminBlogServices.getUserEmails();
      const emailList = userEmails.map((user) => user.email);
      await sendBlogPostEmail(emailList, blog.postId, blog.title, blog.headline);

      // Send the response
      return httpResponse(req, res, EResponseStatusCode.CREATED, EResponseMessage.BLOG_CREATED, connectedBlog);
    } catch (error) {
      httpError(next, error, req);
    }
  }
};