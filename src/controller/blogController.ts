import { NextFunction, Request, Response } from "express";
import httpResponse from "../utils/httpResponse";
import { EErrorStatusCode, EResponseStatusCode } from "../constant/application";
import httpError from "../utils/httpError";
import blogDbServices from "../services/blogDbServices";
import { ENTITY_EXISTS, ENTITY_NOT_FOUND, EResponseMessage } from "../constant/responseMessage";
import { IUser } from "../types/prismaUserTypes";
import userAuthDbServices from "../services/userAuthDbServices";

interface IFetchBlogs extends Request {
  query: {
    key?: string;
    cat?: string | string[];
  };
}

interface ILikeBlog extends Request {
  authenticatedUser: IUser;
  params: {
    blogId: string;
  };
}

export default {
  fetchBlogs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req as IFetchBlogs;
      const { key, cat } = query;

      // Parse categories
      let categoryArray: string[] = [];
      if (cat) {
        if (typeof cat === "string") {
          if (cat.includes(",")) {
            categoryArray = cat.split(",").map((category) => category.trim());
          } else {
            categoryArray = [cat.trim()];
          }
        }
      }

      // Handle search key
      const searchKey = key?.trim() || ""; // Default to empty string if no key

      const blogs = await blogDbServices.getBlogsbyIdandCat(searchKey, categoryArray);
      if (!blogs || blogs.length === 0) {
        return httpError(next, new Error(ENTITY_NOT_FOUND("Blog")), req, EErrorStatusCode.NOT_FOUND);
      }

      return httpResponse(req, res, EResponseStatusCode.OK, "Blogs fetched successfully", { blogs });
    } catch (error) {
      return httpError(next, error, req);
    }
  },

  like: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body
      const { authenticatedUser, params } = req as ILikeBlog;

      // Find user
      const user = await userAuthDbServices.findUserById(authenticatedUser.userId as string);
      if (!user) {
        return httpError(next, new Error(EResponseMessage.USER_NOT_FOUND), req, EErrorStatusCode.NOT_FOUND);
      }

      // Find blog
      const blog = await blogDbServices.findBlogbyId(Number(params.blogId));
      if (!blog) {
        return httpError(next, new Error(ENTITY_NOT_FOUND("Blog")), req, EErrorStatusCode.NOT_FOUND);
      }

      // Check if already liked
      const isAlreadyLiked = await blogDbServices.checkBlogAlreadyLiked(user.userId, Number(params.blogId));

      if (isAlreadyLiked) {
        return httpError(next, new Error(ENTITY_EXISTS("Like")), req, EErrorStatusCode.FORBIDDEN);
      }

      // Like the blog
      await blogDbServices.likeBlogbyId(user.userId, Number(params.blogId));

      httpResponse(req, res, EResponseStatusCode.OK, "Blog liked", {});
    } catch (error) {
      httpError(next, error, req);
    }
  },

  unlike: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body
      const { authenticatedUser, params } = req as ILikeBlog;

      // Find user
      const user = await userAuthDbServices.findUserById(authenticatedUser.userId as string);
      if (!user) {
        return httpError(next, new Error(EResponseMessage.USER_NOT_FOUND), req, EErrorStatusCode.NOT_FOUND);
      }

      // Find blog
      const blog = await blogDbServices.findBlogbyId(Number(params.blogId));
      if (!blog) {
        return httpError(next, new Error(ENTITY_NOT_FOUND("Blog")), req, EErrorStatusCode.NOT_FOUND);
      }

      // Check if already liked
      const isAlreadyLiked = await blogDbServices.checkBlogAlreadyLiked(user.userId, Number(params.blogId));

      if (!isAlreadyLiked) {
        return httpError(next, new Error(ENTITY_NOT_FOUND("Like")), req, EErrorStatusCode.FORBIDDEN);
      }

      // Unlike the blog
      await blogDbServices.unlikeBlogbyId(user.userId, Number(params.blogId));

      httpResponse(req, res, EResponseStatusCode.OK, "Blog liked", {});
    } catch (error) {
      httpError(next, error, req);
    }
  }

  
};
