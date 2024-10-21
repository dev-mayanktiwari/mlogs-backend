import { User as PrismaUser, AccountConfirmation, RefreshToken, PasswordRecovery, Like, Comment, SavedPost } from "@prisma/client";

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
