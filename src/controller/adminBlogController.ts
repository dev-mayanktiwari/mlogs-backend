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

interface IUpdateBlog extends Request {
  body: {
    title: string;
    content: string;
    headline: string;
    category?: string[];
  };
  params: {
    postId: string;
  };
}

interface IDeleteBlog extends Request {
  params: {
    postId: string;
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
      await sendBlogPostEmail(emailList, blog.postId, blog.title, String(blog.headline));

      // Send the response
      return httpResponse(req, res, EResponseStatusCode.CREATED, EResponseMessage.BLOG_CREATED, connectedBlog);
    } catch (error) {
      httpError(next, error, req);
    }
  },

  updateBlog: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate Blog body
      const { body } = req as IUpdateBlog;
      const parsed = postBlogSchema.safeParse(body);

      if (!parsed.success) {
        const errorMessage = parsed.error?.issues.map((issue) => issue.message).join(", ");
        return httpError(next, new Error(errorMessage || "Invalid inputs"), req, EErrorStatusCode.BAD_REQUEST);
      }

      // Extract postId from the route parameters
      const { postId } = req.params;
      const { title, content, headline, category } = parsed.data;

      // Find the existing blog
      const existingBlog = await adminBlogDbServices.findBlogById(Number(postId));
      if (!existingBlog) {
        return httpError(next, new Error("Blog post not found"), req, EErrorStatusCode.NOT_FOUND);
      }

      // Update categories if provided
      let categories: Category[] = [];
      if (category) {
        categories = await adminBlogDbServices.createCategory(category);
      }

      // Update the blog post
      const updatedBlog: Post = await adminBlogDbServices.updateBlog(Number(postId), title, content, headline);

      // Connect the blog with the category
      if (categories.length > 0) {
        // await adminBlogDbServices.deleteOldCategories(Number(postId));
        await adminBlogDbServices.connectBlogWithCategory(Number(postId), categories);
      }

      // Send the response
      return httpResponse(req, res, EResponseStatusCode.OK, EResponseMessage.BLOG_UPDATED, updatedBlog);
    } catch (error) {
      httpError(next, error, req);
    }
  },

  deleteBlog: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract postId from the route parameters
      const { params } = req as IDeleteBlog;
      const { postId } = params;
      // Find the existing blog
      const existingBlog = await adminBlogDbServices.findBlogById(Number(postId));
      if (!existingBlog) {
        return httpError(next, new Error("Blog post not found"), req, EErrorStatusCode.NOT_FOUND);
      }

      // Delete the blog post
      await adminBlogDbServices.deleteBlog(Number(postId));

      // Send the response
      return httpResponse(req, res, EResponseStatusCode.OK, EResponseMessage.OPERATION_COMPLETED);
    } catch (error) {
      httpError(next, error, req);
    }
  }
};
