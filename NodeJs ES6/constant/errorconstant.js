import responseConstant from './responseconstant'
import apiResponseConstant from './apiresponseconstant'

const errorMessage  = {};

errorMessage[responseConstant.HTTP_UNAUTHORIZED] = "Unauthorized access";
errorMessage[responseConstant.HTTP_FORBIDDEN] = "Unauthorized access";
errorMessage[responseConstant.HTTP_NOT_IMPLEMENTED] = "Invalid request";
errorMessage[responseConstant.HTTP_NOT_FOUND] = "Page not found";
errorMessage[responseConstant.HTTP_METHOD_NOT_ALLOWED] = "Method not allowed";
errorMessage[apiResponseConstant.PAGE_NOT_FOUND] = "Page not found";
errorMessage[apiResponseConstant.UNAUTHORIZED_ACCESS] = "Unauthorized access";
errorMessage[apiResponseConstant.INVALID_TOKEN] = "Invalid Token";
errorMessage[apiResponseConstant.TOKEN_EXPIRED] = "Token Expired";
errorMessage[apiResponseConstant.MISSING_TOKEN] = "Token Missing";
errorMessage[apiResponseConstant.PASSWORDS_NOT_MATCH] = "password and confirm password  must be same";
errorMessage[apiResponseConstant.INVALID_CREDENTIALS] = "Invalid credentials";
errorMessage[apiResponseConstant.INVALID_PASSWORD] = "Wrong Password";
errorMessage[apiResponseConstant.USER_NOT_EXIST] = "User not exist";
errorMessage[apiResponseConstant.USER_ALREADY_EXIST] = "User already exists";
errorMessage[apiResponseConstant.EMAIL_ALREADY_EXSIST] = "Email already exists";


const errorCodeMapping = {};

errorCodeMapping[responseConstant.HTTP_UNAUTHORIZED] = responseConstant.HTTP_UNAUTHORIZED;
errorCodeMapping[responseConstant.HTTP_FORBIDDEN] = responseConstant.HTTP_FORBIDDEN;
errorCodeMapping[responseConstant.HTTP_NOT_IMPLEMENTED] = responseConstant.HTTP_NOT_IMPLEMENTED;
errorCodeMapping[responseConstant.HTTP_NOT_FOUND] = responseConstant.HTTP_NOT_FOUND;
errorCodeMapping[responseConstant.HTTP_METHOD_NOT_ALLOWED] =responseConstant.HTTP_METHOD_NOT_ALLOWED;
errorCodeMapping[apiResponseConstant.UNAUTHORIZED_ACCESS] =responseConstant.HTTP_UNAUTHORIZED;
errorCodeMapping[apiResponseConstant.ROLE_NOT_AUTHORIZED] = responseConstant.HTTP_METHOD_NOT_ALLOWED;
errorCodeMapping[apiResponseConstant.CONTEXT_NOT_AUTHORIZED] = responseConstant.HTTP_METHOD_NOT_ALLOWED;
errorCodeMapping[apiResponseConstant.UNKNOWN_ERROR_OCCURRED] = responseConstant.HTTP_INTERNAL_SERVER_ERROR;
errorCodeMapping[apiResponseConstant.INVALID_JSON_REQUEST] = responseConstant.HTTP_BAD_REQUEST;
errorCodeMapping[apiResponseConstant.VALIDATION_FAILED] = responseConstant.HTTP_BAD_REQUEST;
errorCodeMapping[apiResponseConstant.MISSING_REQUIRED_PARAMETERS ] = responseConstant.HTTP_BAD_REQUEST;
errorCodeMapping[apiResponseConstant.MISSING_TOKEN ] = responseConstant.HTTP_BAD_REQUEST;
errorCodeMapping[apiResponseConstant.INVALID_VALUES_IN_PARAMETERS] = responseConstant.HTTP_BAD_REQUEST;
errorCodeMapping[apiResponseConstant.MAX_LENGTH_EXCEEDED] = responseConstant.HTTP_BAD_REQUEST;
errorCodeMapping[apiResponseConstant.MIN_LENGTH_NOT_REACHED] = responseConstant.HTTP_BAD_REQUEST;


module.exports.errorMessage =errorMessage;
module.exports.errorCodeMapping =errorCodeMapping;
