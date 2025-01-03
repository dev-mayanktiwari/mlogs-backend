import express, { Application, NextFunction, Request, Response } from "express";
import authRouter from "./router/userAuthRouter";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { EResponseMessage } from "./constant/responseMessage";
import httpError from "./utils/httpError";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import checkupRouter from "./router/checkupRouter";
import blogRouter from "./router/blogRouter";
import authMiddleware from "./middleware/authentication";
import authRateLimitHandler from "./middleware/authRateLimitHandler";
import generalRateLimitHandler from "./middleware/generalRateLimitHandler";
import adminAuthRouter from "./router/adminAuthRouter";
import adminAuthMiddleware from "./middleware/adminAuthentication";
import adminBlogRouter from "./router/adminBlogRouter";
import fetchBlogRouter from "./router/fetchBlogRouter";
import corsOptions from "./services/corsService";

const app: Application = express();
const allowedOrigins = corsOptions();

// Middleware
app.use(helmet());
app.use(cookieParser());
app.use(cors(allowedOrigins));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/user/checkup", checkupRouter);
app.use("/api/v1/user/auth", authRateLimitHandler, authRouter);
app.use("/api/v1/blog/fetch", generalRateLimitHandler, fetchBlogRouter);
app.use("/api/v1/user/blog", generalRateLimitHandler, authMiddleware, blogRouter);
app.use("/api/v1/admin/auth", adminAuthRouter);
app.use("/api/v1/admin/blog", adminAuthMiddleware, adminBlogRouter);

//404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
  try {
    throw new Error(EResponseMessage.NOT_FOUND);
  } catch (error) {
    httpError(next, error, req, 404);
  }
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
