import { NextFunction, Request, Response } from "express";
import httpResponse from "../utils/httpResponse";
import { EErrorStatusCode, EResponseStatusCode } from "../constant/application";
import httpError from "../utils/httpError";
import blogDbServices from "../services/blogDbServices";
import { ENTITY_EXISTS, ENTITY_NOT_FOUND, EResponseMessage } from "../constant/responseMessage";
import { IUser } from "../types/prismaUserTypes";
import userAuthDbServices from "../services/userAuthDbServices";
import { blogCommentSchema } from "../types/blogTypes";

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

interface ICommentBlog extends Request {
  authenticatedUser: IUser;
  body: {
    text: string;
  };
  params: {
    blogId: string;
  };
}

interface IEditCommentBlog extends Request {
  authenticatedUser: IUser;
  body: {
    text: string;
  };
  params: {
    commentId: string;
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

      httpResponse(req, res, EResponseStatusCode.OK, "Blog unliked", {});
    } catch (error) {
      httpError(next, error, req);
    }
  },

  totalLikes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params } = req as ILikeBlog;
      const { blogId } = params;

      const blog = await blogDbServices.findBlogbyId(Number(params.blogId));
      if (!blog) {
        return httpError(next, new Error(ENTITY_NOT_FOUND("Blog")), req, EErrorStatusCode.NOT_FOUND);
      }

      const totalLikes = await blogDbServices.getTotalLikes(Number(blogId));

      return httpResponse(req, res, EResponseStatusCode.OK, `Total likes: ${totalLikes}`, { likes: totalLikes });
    } catch (error) {
      httpError(next, error, req);
    }
  },

  comment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body
      const { authenticatedUser, params, body } = req as ICommentBlog;
      const parsed = blogCommentSchema.safeParse(body);
      if (!parsed.success) {
        const errorMessage = parsed.error?.issues.map((issue) => issue.message).join(", ");
        return httpError(next, new Error(errorMessage || "Invalid inputs"), req, EErrorStatusCode.BAD_REQUEST);
      }

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

      // Check if already commented
      const isAlreadyCommented = await blogDbServices.checkBlogAlreadyCommented(user.userId, Number(params.blogId));
      if (isAlreadyCommented) {
        return httpError(next, new Error(ENTITY_EXISTS("Comment")), req, EErrorStatusCode.FORBIDDEN);
      }

      // Comment the blog
      const comment = await blogDbServices.commentBlogbyId(user.userId, Number(params.blogId), parsed.data.text);

      httpResponse(req, res, EResponseStatusCode.OK, "Blog commented", { comment: comment });
    } catch (error) {
      httpError(next, error, req);
    }
  },

  uncomment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body
      const { authenticatedUser, params } = req as IEditCommentBlog;

      // Find user
      const user = await userAuthDbServices.findUserById(authenticatedUser.userId as string);
      if (!user) {
        return httpError(next, new Error(EResponseMessage.USER_NOT_FOUND), req, EErrorStatusCode.NOT_FOUND);
      }

      const isTrueComment = await blogDbServices.findCommentbyId(user.userId, Number(params.commentId));
      if (!isTrueComment) {
        return httpError(next, new Error(ENTITY_NOT_FOUND("Comment")), req, EErrorStatusCode.FORBIDDEN);
      }

      // Uncomment the blog
      await blogDbServices.uncommentBlogbyId(user.userId, Number(params.commentId));

      httpResponse(req, res, EResponseStatusCode.OK, "Blog uncommented", {});
    } catch (error) {
      httpError(next, error, req);
    }
  },

  getTotalComments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params } = req as ICommentBlog;
      const { blogId } = params;

      const blog = await blogDbServices.findBlogbyId(Number(params.blogId));
      if (!blog) {
        return httpError(next, new Error(ENTITY_NOT_FOUND("Blog")), req, EErrorStatusCode.NOT_FOUND);
      }

      const totalComments = await blogDbServices.getTotalComments(Number(blogId));

      return httpResponse(req, res, EResponseStatusCode.OK, `Total comments: ${totalComments}`, { comments: totalComments });
    } catch (error) {
      httpError(next, error, req);
    }
  },

  editComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body
      const { authenticatedUser, params, body } = req as IEditCommentBlog;
      const parsed = blogCommentSchema.safeParse(body);
      if (!parsed.success) {
        const errorMessage = parsed.error?.issues.map((issue) => issue.message).join(", ");
        return httpError(next, new Error(errorMessage || "Invalid inputs"), req, EErrorStatusCode.BAD_REQUEST);
      }

      // Find user
      const user = await userAuthDbServices.findUserById(authenticatedUser.userId as string);
      if (!user) {
        return httpError(next, new Error(EResponseMessage.USER_NOT_FOUND), req, EErrorStatusCode.NOT_FOUND);
      }

      // Confirm if the user owns the comment
      const isTrueComment = await blogDbServices.findCommentbyId(user.userId, Number(params.commentId));
      if (!isTrueComment) {
        return httpError(next, new Error(ENTITY_NOT_FOUND("Comment")), req, EErrorStatusCode.FORBIDDEN);
      }

      // Edit the comment
      const comment = await blogDbServices.editComment(Number(params.commentId), parsed.data.text);

      httpResponse(req, res, EResponseStatusCode.OK, "Comment edited", { comment: comment });
    } catch (error) {
      httpError(next, error, req);
    }
  },

  fetchComments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params } = req as ICommentBlog;
      const { blogId } = params;

      const blog = await blogDbServices.findBlogbyId(Number(params.blogId));
      if (!blog) {
        return httpError(next, new Error(ENTITY_NOT_FOUND("Blog")), req, EErrorStatusCode.NOT_FOUND);
      }

      const comments = await blogDbServices.getComments(Number(blogId));

      return httpResponse(req, res, EResponseStatusCode.OK, "Comments fetched", { comments });
    } catch (error) {
      httpError(next, error, req);
    }
  },

  save: async (req: Request, res: Response, next: NextFunction) => {
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

      // Check if already saved
      const isAlreadySaved = await blogDbServices.checkBlogAlreadySaved(user.userId, Number(params.blogId));

      if (isAlreadySaved) {
        return httpError(next, new Error(ENTITY_EXISTS("Save")), req, EErrorStatusCode.FORBIDDEN);
      }

      // Save the blog
      await blogDbServices.saveBlogbyId(user.userId, Number(params.blogId));

      return httpResponse(req, res, EResponseStatusCode.OK, "Blog saved", {});
    } catch (error) {
      httpError(next, error, req);
    }
  },

  unsave: async (req: Request, res: Response, next: NextFunction) => {
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

      // Check if already saved
      const isAlreadySaved = await blogDbServices.checkBlogAlreadySaved(user.userId, Number(params.blogId));

      if (!isAlreadySaved) {
        return httpError(next, new Error(ENTITY_NOT_FOUND("Save")), req, EErrorStatusCode.FORBIDDEN);
      }

      // Unsave the blog
      await blogDbServices.unsaveBlogbyId(user.userId, Number(params.blogId));

      return httpResponse(req, res, EResponseStatusCode.OK, "Blog unsaved", {});
    } catch (error) {
      httpError(next, error, req);
    }
  },

  totalSaves: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { params } = req as ILikeBlog;
      const { blogId } = params;

      const blog = await blogDbServices.findBlogbyId(Number(params.blogId));
      if (!blog) {
        return httpError(next, new Error(ENTITY_NOT_FOUND("Blog")), req, EErrorStatusCode.NOT_FOUND);
      }

      const totalSaves = await blogDbServices.getTotalSaves(Number(blogId));

      return httpResponse(req, res, EResponseStatusCode.OK, `Total saves: ${totalSaves}`, { saves: totalSaves });
    } catch (error) {
      httpError(next, error, req);
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
  }
};
