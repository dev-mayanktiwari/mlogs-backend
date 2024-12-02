import { NextFunction, Request, Response } from "express";
import { EErrorStatusCode, EResponseStatusCode } from "../constant/application";
import { ENTITY_NOT_FOUND, EResponseMessage } from "../constant/responseMessage";
import blogDbServices from "../services/blogDbServices";
import httpError from "../utils/httpError";
import httpResponse from "../utils/httpResponse";
import { IUser } from "../types/prismaUserTypes";
import userAuthDbServices from "../services/userAuthDbServices";
import { AppConfig } from "../config";

interface IFetchBlogs extends Request {
  query: {
    key?: string;
    cat?: string | string[];
  };
}

interface IAuthenticatedRequest extends Request {
  authenticatedUser: IUser;
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

  getBlog: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params } = req as ILikeBlog;
      const { blogId } = params;

      const blog = await blogDbServices.findBlogbyId(Number(blogId));
      if (!blog) {
        return httpError(next, new Error(ENTITY_NOT_FOUND("Blog")), req, EErrorStatusCode.NOT_FOUND);
      }

      return httpResponse(req, res, EResponseStatusCode.OK, "Blog fetched", { blog: blog });
    } catch (error) {
      httpError(next, error, req);
    }
  },

  getComments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params } = req as ILikeBlog;
      const { blogId } = params;

      const comments = await blogDbServices.getComments(Number(blogId));
      if (!comments) {
        return httpError(next, new Error(ENTITY_NOT_FOUND("Comment")), req, EErrorStatusCode.NOT_FOUND);
      }

      return httpResponse(req, res, EResponseStatusCode.OK, "Comments fetched successfully", { comments });
    } catch (error) {
      httpError(next, error, req);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cookies } = req;
      const { authenticatedUser } = req as IAuthenticatedRequest;
      const { refreshToken } = cookies as { refreshToken: string | undefined };

      // Utility function to clear cookies
      const clearAuthCookies = () => {
        const cookieOptions = {
          path: "/api/v1/user",
          domain: AppConfig.get("DOMAIN") as string,
          sameSite: "lax" as const,
          httpOnly: true,
          secure: !(AppConfig.get("ENV") === "development"),
          expires: new Date(0) // Expire immediately
        };

        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);
      };

      // Clear refresh token from database if present
      if (refreshToken) {
        await userAuthDbServices.deleteRefreshToken(authenticatedUser.userId as string);
      }

      // Clear cookies
      clearAuthCookies();

      // Send response after successful logout
      httpResponse(req, res, EResponseStatusCode.OK, EResponseMessage.LOGOUT_SUCCESS, {});
    } catch (error) {
      httpError(next, error, req, EErrorStatusCode.INTERNAL_SERVER_ERROR);
    }
  },

  getGuestbook: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await blogDbServices.getGuestbookMessages();
      return httpResponse(req, res, EResponseStatusCode.OK, "Guestbook fetched successfully", { messages });
    } catch (error) {
      httpError(next, error, req);
    }
  }
};
