 
 
 

import { IUserInterface } from "../types/userInterface";
import prisma from "./generatePrismaClient";

export default {
  findUserByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: {
        email
      }
    });
  },
  findUserByUsername: (username: string) => {
    return prisma.user.findUnique({
      where: {
        username
      }
    });
  },
  createUser: (payload: IUserInterface) => {
    return prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        username: payload.username,
        password: payload.password,
        accountConfirmation: {
          create: {
            token: payload.accountConfirmation.token,
            code: payload.accountConfirmation.code,
            isVerified: payload.accountConfirmation.isVerified,
            timestamp: payload.accountConfirmation.timestamp
          }
        }
      },
      select: {
        userId: true,
        name: true,
        email: true,
        username: true,
        accountConfirmation: true
        // Remove accountConfirmation if not needed
      }
    });
  }
};

