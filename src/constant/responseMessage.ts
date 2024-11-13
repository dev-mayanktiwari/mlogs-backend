export const enum EResponseMessage {
  USER_CREATED = "User account created successfully.",
  DATA_RETRIEVED = "Data retrieved successfully.",
  OPERATION_COMPLETED = "Operation completed successfully.",
  USER_UPDATED = "User profile updated successfully.",
  USER_DELETED = "User account deleted successfully.",
  USER_FOUND = "User found.",
  LOGIN_SUCCESS = "Login successful.",
  LOGOUT_SUCCESS = "Logout successful.",
  PASSWORD_CHANGED = "Password changed successfully.",
  ACCESS_DENIED = "Access denied.",
  NOT_FOUND = "Resource not found.",
  INTERNAL_SERVER_ERROR = "Internal server error. Please try again later.",
  BAD_REQUEST = "Invalid request parameters.",
  UNAUTHORIZED = "Unauthorized access.",
  FORBIDDEN = "Forbidden request.",
  VALIDATION_ERROR = "Validation error.",
  SESSION_EXPIRED = "Session expired. Please log in again.",
  AUTH_TOO_MANY_REQUESTS = "Too many requests. Please try again later after 5 minutes.",
  USERNAME_TAKEN = "Username is already taken.",
  INVALID_TOKEN_CODE = "The verification link is invalid.",
  ACCOUNT_ALREADY_VERIFIED = "Account is already verified.",
  USER_ID_NOT_FOUND = "User ID not found.",
  INVALID_CREDENTIALS = "Invalid credentials.",
  NO_TOKEN_FOUND = "No token found.",
  TOKEN_EXPIRED = "Token expired.",
  NO_SNIFFING = "No sniffing allowed.",
  ACCOUNT_NOT_VERIFIED = "Account is not verified.",
  TIMEOUT = "URL timeout.",
  TOKEN_REFRESHED = "Token refreshed.",
  PASSWORD_SAME = "New password must be different from the last password.",
  USER_NOT_FOUND = "User not found.",
  BLOG_CREATED = "Blog created successfully.",
  BLOG_UPDATED = "Blog updated successfully."
}

export const MIN_LENGTH_MESSAGE = (entity: string, length: number) => `${entity} must be ${length} characters long.`;

export const MAX_LENGTH_MESSAGE = (entity: string, length: number) => `${entity} must be at most ${length} characters long.`;

export const ENTITY_EXISTS = (entity: string) => `${entity} already exists.`;
export const ENTITY_NOT_FOUND = (entity: string) => `No ${entity} found.`;
