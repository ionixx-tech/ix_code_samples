<?php

namespace utilities\constant;

class ApiResponseConstant {
	const UNAUTHORIZED_ACCESS = 1000;
	const HTTP_HEADER_INFO_MISSING = 1001;
	const HMAC_CHECK_FAILED = 1002;
	const ROLE_NOT_AUTHORIZED = 1003;
	const INVALID_CREDENTIAL = 1004;
	const UNKNOWN_ERROR_OCCURRED = 1008;
	const INVALID_JSON_REQUEST = 1009;
	
	const VALIDATION_FAILED = 1051;
	const MISSING_REQUIRED_PARAMETERS = 1052;
	const INVALID_VALUES_IN_PARAMETERS = 1053;
	const MAX_LENGTH_EXCEEDED = 1054;
	const MIN_LENGTH_NOT_REACHED = 1055;
	const INVALID_MOBILE_NUMBERS = 1056;
	
	const COMMENT_LIKE_ALREADY_EXIST = 2300;
	
	// user
	const USER_EXIST_WITH_SAME_DEVICE = 1103;
	const USER_REGISTRATION_UNABLE_TO_SEND_VERIFICATION_CODE = 1104;
	const USER_REGISTRATION_INVALID_VERIFICATION_CODE = 1105;
	const USER_REGISTRATION_VERIFICATION_CODE_EXPIRED = 1106;
	
	const USER_NOT_EXIST = 2000;
	const USER_CANNOT_FOLLOW_UNFOLLOW_SELF = 2002;
	const PROFILE_IMAGE_NOT_EXIST = 2003;
	const USER_ALREADY_FOLLOWED = 2004;
	const USER_NOT_FOLLOWED = 2005;
	const USER_CANNOT_UPDATE_OTHERS_INFO = 2006;
	
	// social group
	const SOCIAL_GROUP_NOT_EXIST = 2100;
	const SOCIAL_GROUP_IN_USE = 2101;
	const SOCIAL_GROUP_CONTACT_NOT_EXIST = 2102;
	
	// media
	const MEDIA_NOT_EXIST = 2200;
	const MEDIA_SHARE_INVALID_recipient = 2201;
	const MEDIA_ALREADY_SHARED_TO_PUBLIC = 2202;
	const MEDIA_NOT_AUTHORIZED_TO_DELETE = 2203;
	const MEDIA_SHARE_INVALID_IDENTIFIER = 2204;
	
	// media like
	const LIKE_ALREADY_EXIST = 2600;
	const LIKE_NOT_EXIST = 2601;
	
	// comment
	const COMMENT_NOT_EXIST = 2300;
}