<?php
use utilities\constant\ResponseConstant;
use utilities\constant\ApiResponseConstant;

$GLOBALS ['error_message'] = [ 
		ResponseConstant::HTTP_UNAUTHORIZED => "Unauthorized access",
		ResponseConstant::HTTP_FORBIDDEN => "Unauthorized access",
		ResponseConstant::HTTP_NOT_IMPLEMENTED => "Invalid request",
		ResponseConstant::HTTP_NOT_FOUND => "Not found",
		ResponseConstant::HTTP_METHOD_NOT_ALLOWED => "Method not allowed",
		
		ApiResponseConstant::UNAUTHORIZED_ACCESS => "Unauthorized access.",
		ApiResponseConstant::ROLE_NOT_AUTHORIZED => "Not authorized to access resource.",
		ApiResponseConstant::HTTP_HEADER_INFO_MISSING => "Authentication info missing.",
		ApiResponseConstant::HMAC_CHECK_FAILED => "Not authorized to process the request as HMAC value not matched.",
		ApiResponseConstant::INVALID_CREDENTIAL => "Invalid credential",
		ApiResponseConstant::UNKNOWN_ERROR_OCCURRED => "Unable to process the request.",
		ApiResponseConstant::INVALID_JSON_REQUEST => "Unable to parse json content.",
		
		ApiResponseConstant::VALIDATION_FAILED => "Validation error",
		ApiResponseConstant::MISSING_REQUIRED_PARAMETERS => "Required parameter(s) missing.",
		ApiResponseConstant::INVALID_VALUES_IN_PARAMETERS => "Invalid parameter value.",
		ApiResponseConstant::MAX_LENGTH_EXCEEDED => "Parameter(s) maximum characters length exceeded.",
		ApiResponseConstant::MIN_LENGTH_NOT_REACHED => "Parameter(s) minimum characters length required.",
		
		ApiResponseConstant::SOCIAL_GROUP_IN_USE => "Group name already exist",
		ApiResponseConstant::COMMENT_LIKE_ALREADY_EXIST => "comment_like already exist",
		
		//user
		ApiResponseConstant::USER_NOT_EXIST => "user not exist",
		ApiResponseConstant::USER_EXIST_WITH_SAME_DEVICE => "Mobile number with requested device ID already registered",
		ApiResponseConstant::USER_REGISTRATION_UNABLE_TO_SEND_VERIFICATION_CODE => "Unable to send verification code via sms",
		ApiResponseConstant::USER_REGISTRATION_INVALID_VERIFICATION_CODE => "Verfication code invalid",
		ApiResponseConstant::USER_REGISTRATION_VERIFICATION_CODE_EXPIRED => "Verfication code expired",
		ApiResponseConstant::USER_CANNOT_FOLLOW_UNFOLLOW_SELF => "User cannot follow/unfollow own profile",
		ApiResponseConstant::PROFILE_IMAGE_NOT_EXIST => "Profile image not exist in S3",
		ApiResponseConstant::USER_ALREADY_FOLLOWED => "User already follow the requested user",
		ApiResponseConstant::USER_NOT_FOLLOWED => "User not following the requested user yet",
		ApiResponseConstant::USER_CANNOT_UPDATE_OTHERS_INFO => "Infomation cannot update for others",
		
		// social group
		ApiResponseConstant::SOCIAL_GROUP_CONTACT_NOT_EXIST => "social_group_contact not exist",
		ApiResponseConstant::SOCIAL_GROUP_NOT_EXIST => "social_group not exist",
		
		// media
		ApiResponseConstant::MEDIA_NOT_EXIST => "media not exist",
		ApiResponseConstant::MEDIA_SHARE_INVALID_recipient => "Invalid recipient(s): ##ERROR_DETAILS##",
		ApiResponseConstant::MEDIA_ALREADY_SHARED_TO_PUBLIC => "Requested media already shared to public",
		ApiResponseConstant::MEDIA_NOT_AUTHORIZED_TO_DELETE => "Requested media not authorized to delete",
		ApiResponseConstant::MEDIA_SHARE_INVALID_IDENTIFIER => "Invalid media identifier: ##ERROR_DETAILS##",
		
		
		// like
		ApiResponseConstant::LIKE_ALREADY_EXIST => "Like already exist for requested user", 
		ApiResponseConstant::LIKE_NOT_EXIST => "Like not exist for requested user", 
		
		//comment
		ApiResponseConstant::COMMENT_NOT_EXIST => "Comment not exist"
		
];

$GLOBALS ['error_code_mapping'] = [ 
		ResponseConstant::HTTP_UNAUTHORIZED => ResponseConstant::HTTP_UNAUTHORIZED,
		ResponseConstant::HTTP_FORBIDDEN => ResponseConstant::HTTP_FORBIDDEN,
		ResponseConstant::HTTP_NOT_IMPLEMENTED => ResponseConstant::HTTP_NOT_IMPLEMENTED,
		ResponseConstant::HTTP_NOT_FOUND => ResponseConstant::HTTP_NOT_FOUND,
		ResponseConstant::HTTP_METHOD_NOT_ALLOWED => ResponseConstant::HTTP_METHOD_NOT_ALLOWED,
		
		ApiResponseConstant::UNAUTHORIZED_ACCESS => ResponseConstant::HTTP_UNAUTHORIZED,
		ApiResponseConstant::ROLE_NOT_AUTHORIZED => ResponseConstant::HTTP_METHOD_NOT_ALLOWED,
		ApiResponseConstant::HTTP_HEADER_INFO_MISSING => ResponseConstant::HTTP_METHOD_NOT_ALLOWED,
		ApiResponseConstant::HMAC_CHECK_FAILED => ResponseConstant::HTTP_UNAUTHORIZED,
		ApiResponseConstant::INVALID_JSON_REQUEST => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::UNKNOWN_ERROR_OCCURRED => ResponseConstant::HTTP_INTERNAL_SERVER_ERROR,
		
		ApiResponseConstant::VALIDATION_FAILED => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::MISSING_REQUIRED_PARAMETERS => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::INVALID_VALUES_IN_PARAMETERS => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::MAX_LENGTH_EXCEEDED => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::MIN_LENGTH_NOT_REACHED => ResponseConstant::HTTP_BAD_REQUEST,
		
		ApiResponseConstant::USER_NOT_EXIST => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::SOCIAL_GROUP_IN_USE => ResponseConstant::HTTP_CONFLICT,
		ApiResponseConstant::MEDIA_NOT_EXIST => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::COMMENT_LIKE_ALREADY_EXIST => ResponseConstant::HTTP_CONFLICT,
		ApiResponseConstant::USER_ALREADY_FOLLOWED => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::USER_NOT_FOLLOWED => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::USER_CANNOT_UPDATE_OTHERS_INFO => ResponseConstant::HTTP_BAD_REQUEST,
		
		ApiResponseConstant::SOCIAL_GROUP_CONTACT_NOT_EXIST => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::SOCIAL_GROUP_NOT_EXIST => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::LIKE_ALREADY_EXIST => ResponseConstant::HTTP_CONFLICT,
		
		ApiResponseConstant::LIKE_NOT_EXIST => ResponseConstant::HTTP_BAD_REQUEST,
		
		ApiResponseConstant::USER_EXIST_WITH_SAME_DEVICE => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::USER_REGISTRATION_INVALID_VERIFICATION_CODE => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::USER_REGISTRATION_VERIFICATION_CODE_EXPIRED => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::USER_CANNOT_FOLLOW_UNFOLLOW_SELF => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::PROFILE_IMAGE_NOT_EXIST => ResponseConstant::HTTP_BAD_REQUEST,
		
		ApiResponseConstant::COMMENT_NOT_EXIST => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::MEDIA_SHARE_INVALID_recipient => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::MEDIA_ALREADY_SHARED_TO_PUBLIC => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::MEDIA_NOT_AUTHORIZED_TO_DELETE => ResponseConstant::HTTP_BAD_REQUEST,
		ApiResponseConstant::MEDIA_SHARE_INVALID_IDENTIFIER => ResponseConstant::HTTP_BAD_REQUEST,
]
;
