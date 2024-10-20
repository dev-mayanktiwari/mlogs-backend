export const enum EResponseMessage {
  USER_CREATED = "User account created successfully.",
  DATA_RETRIEVED = "Data retrieved successfully.",
  OPERATION_COMPLETED = "Operation completed successfully.",
  USER_UPDATED = "User profile updated successfully.",
  USER_DELETED = "User account deleted successfully.",
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
  TOO_MANY_REQUESTS = "Too many requests. Please try again later.",
  USERNAME_TAKEN = "Username is already taken.",
  INVALID_TOKEN_CODE = "The verification link is invalid.",
  ACCOUNT_ALREADY_VERIFIED = "Account is already verified."
}

export const MIN_LENGTH_MESSAGE = (entity: string, length: number) => `${entity} must be ${length} characters long.`;

export const MAX_LENGTH_MESSAGE = (entity: string, length: number) => `${entity} must be at most ${length} characters long.`;

export const ENTITY_EXISTS = (entity: string) => `${entity} already exists.`;