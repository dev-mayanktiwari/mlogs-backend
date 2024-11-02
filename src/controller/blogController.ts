import { NextFunction, Request, Response } from "express";
import httpResponse from "../utils/httpResponse";
import { EErrorStatusCode, EResponseStatusCode } from "../constant/application";
import httpError from "../utils/httpError";
import blogDbServices from "../services/blogDbServices";
import { ENTITY_NOT_FOUND } from "../constant/responseMessage";

interface IFetchBlogs extends Request {
  query: {
    key?: string;
    cat?: string | string[];
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
  }
};
