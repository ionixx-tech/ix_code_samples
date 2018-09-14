INTERNAL_SERVER_ERROR = 500
BAD_REQUEST = 400
OK = 200
NOT_FOUND = 404

ACCESS_DENIED = 1000
INVALID_USER_PASSWORD = 1001
SESSION_EXPIRED = 1002
MULTI_SESSION_ACTIVE = 1003
INVALID_AUTHORIZATION = 1004
VALIDATION_MISSING = 1005
MISSING_PARAMETERS = 1006
INVALID_PARAMETERS = 1007

RESOURCE_NOT_FOUND = 1011
MULTIPLE_EMAIL_FOUND = 1012
USERNAME_NOT_FOUND = 1013
TOKEN_EXPIRED = 1014
INVALID_TRADE = 1015
INVALID_OWNER = 1016
USER__NOT_EXIST = 1017
UNAUTHORIZED_ACCESS = 401
ACTIVATION_EXPIRED = 1018

error_messages = {
    500: "Internal Server Error",
    200: "OK",
    400: "Bad Request",
    401: "UNAUTHORIZED ACCESS",
    404: "Not Found",

    1000: "Access denied",
    1001: "Invalid username or password",
    1002: "Your session has been expired.",
    1003: "Only one session is allowed. You have another session active at the moment.",
    1004: "INVALID AUTHORIZATION FOUND",
    1005: "VALIDATION FAILED",
    1006: "Missing required parameter.",
    1007: "Invalid parameters.",
    1011: "Resource not found.",
    1012: "Multiple Email Configured.Please contact your admin for support",
    1013: "Account not found",
    1014: "Token Expired",

    1015: "Trade not valid",
    1016: "Owner only can cancel the trade.",
    1017: "User Not Exist",
    1018: "Account Activation Expired",
}
