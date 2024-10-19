export const enum EApplicationEnvirontment {
  PRODUCTION = "production",
  DEVELOPMENT = "development"
}

export const enum EResponseStatusCode {
  OK = 200, // Request succeeded
  CREATED = 201, // Resource created successfully
  ACCEPTED = 202, // Request accepted, processing
  NO_CONTENT = 204 // Request succeeded, no content to return
}

export const enum EErrorStatusCode {
  // Client Error Status Codes
  BAD_REQUEST = 400, // Invalid request
  UNAUTHORIZED = 401, // Authentication required
  FORBIDDEN = 403, // Permission denied
  NOT_FOUND = 404, // Resource not found
  METHOD_NOT_ALLOWED = 405, // HTTP method not allowed
  CONFLICT = 409, // Conflict in request, such as duplicate data
  UNPROCESSABLE_ENTITY = 422, // Validation error
  TOO_MANY_REQUESTS = 429, // Rate limit exceeded

  // Server Error Status Codes
  INTERNAL_SERVER_ERROR = 500, // Generic server error
  NOT_IMPLEMENTED = 501, // Not implemented
  BAD_GATEWAY = 502, // Invalid response from upstream server
  SERVICE_UNAVAILABLE = 503, // Service temporarily unavailable
  GATEWAY_TIMEOUT = 504 // Upstream server timed out
}

export enum EUserTypeConstants {
  MIN_PASSWORD_LENGTH = 8,
  MAX_PASSWORD_LENGTH = 25,
  MIN_USERNAME_LENGTH = 5,
  MAX_USERNAME_LENGTH = 15,
  MIN_NAME_LENGTH = 3,
  MAX_NAME_LENGTH = 30
}
