 
 
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from "express";
import httpResponse from "../utils/httpResponse";
import { EErrorStatusCode, EResponseStatusCode } from "../constant/application";
import httpError from "../utils/httpError";
import quicker from "../utils/quicker";
import moment from "moment";
import { registerUserSchema } from "../types/userTypes";
import userAuthDbServices from "../services/userAuthDbServices";
import { ENTITY_EXISTS, EResponseMessage } from "../constant/responseMessage";
import { IUserInterface } from "../types/userInterface";
import { sendEmail } from "../services/sendEmailService";

export default {
  self: (req: Request, res: Response, next: NextFunction) => {
    try {
      throw new Error("This is an error");
      httpResponse(req, res, EResponseStatusCode.OK, "Hello World", { name: "John Doe" });
    } catch (error) {
      httpError(next, error, req);
    }
  },

  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      const parsed = registerUserSchema.safeParse(body);
      if (!parsed.success) {
        const errorMessage = parsed.error?.issues.map((issue) => issue.message).join(", ");
        return httpError(next, new Error(errorMessage || "Invalid inputs"), req, EErrorStatusCode.BAD_REQUEST);
      }

      // Checking account with given email exists
      const userWithEmail = await userAuthDbServices.findUserByEmail(parsed.data.email);
      if (userWithEmail) {
        return httpError(next, new Error(ENTITY_EXISTS("User")), req, EErrorStatusCode.BAD_REQUEST);
      }

      // Checking if the username is already taken
      const userWithUsername = await userAuthDbServices.findUserByUsername(parsed.data.username);
      if (userWithUsername) {
        return httpError(next, new Error(EResponseMessage.USERNAME_TAKEN), req, EErrorStatusCode.BAD_REQUEST);
      }

      // Hash the password
      const hashedPassword = await quicker.hashPassword(parsed.data.password);

      // Account confirmation data

      const token = quicker.generateRandomToken();
      const code = quicker.generateOTP();

      // Register the user
      const payload: IUserInterface = {
        name: parsed.data.name,
        username: parsed.data.username,
        email: parsed.data.email,
        password: hashedPassword,
        accountConfirmation: {
          token,
          code,
          isVerified: false,
          timestamp: null
        }
      };

      // Send email to the user
      await sendEmail(parsed.data.email, parsed.data.name, token, code);

      const newUser = await userAuthDbServices.createUser(payload);

      httpResponse(req, res, EResponseStatusCode.CREATED, "User registered successfully", newUser);
    } catch (error) {
      httpError(next, error, req);
    }
  },

  health: (req: Request, res: Response, next: NextFunction) => {
    try {
      const healthData = {
        application: quicker.getApplicationHealth(),
        system: quicker.getSystemHealth(),
        time: moment(new Date().toISOString()).format("YYYY-MM-DD HH:mm:ss")
      };
      httpResponse(req, res, EResponseStatusCode.OK, "Health Check", healthData);
    } catch (error) {
      httpError(next, error, req);
    }
  }
};

