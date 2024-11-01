import { AccountConfirmation, Comment, Like, PasswordRecovery, RefreshToken, SavedPost, User as PrismaUser } from "@prisma/client";

// Make all properties from PrismaUser optional
type OptionalPrismaUser = Partial<PrismaUser>;

export interface IUser extends OptionalPrismaUser {
  accountConfirmation?: AccountConfirmation | null; // Optional relation
  refreshToken?: RefreshToken | null; // Optional relation
  passwordRecovery?: PasswordRecovery[]; // Optional relation
  likedPosts?: Like[]; // Optional relation
  comments?: Comment[]; // Optional relation
  savedPosts?: SavedPost[]; // Optional relation
}
