<?php

namespace utilities\constant;

class CommonConstant {
	const ERROR_CODE = "error_code";
	const ERROR_MESSAGE = "error_message";
	
	const MESSAGE_TYPE_ERROR = "ERROR";
	const MESSAGE_TYPE_SUCCESS = "SUCCESS";
	const MESSAGE_TYPE_WARNING = "WARNING";
	
	const RESPONSE_TYPE_SUCCESS = "success";
	const RESPONSE_TYPE_FAILURE = "failure";
	const RESPONSE_TYPE_WARNING = "warning";
	
	const RESPONSE_ERROR_CODE = "code";
	const RESPONSE_ERROR_MESSAGE = "message";
	const RESPONSE_ERROR_DESCRIPTION = "description";
	const RESPONSE_ERROR_FIELD = "field";
	
	const FIELD_NAME_PLACE_HOLDER = "##FIELDNAME##";
	const ERROR_DETIALS = "##ERROR_DETAILS##";
	
	const STORAGE_TYPE_SESSION = "SESSION";
	const STORAGE_TYPE_GLOBAL = "GLOBAL";
	
	const ACTION_TYPE_ADD = "add";
	const ACTION_TYPE_UPDATE = "update";
	const ACTION_TYPE_DELETE = "delete";
	const ACTION_TYPE_GET_LIST = "get_list";
	const ACTION_TYPE_RENAME = "rename";
	
	const API_PARAM_TRUE = "true";
	const API_PARAM_FALSE = "false";
	const API_STATUS_ACTIVE = "active";
	const API_STATUS_IN_ACTIVE = "in_active";
	
	const MAX_PAGE_LIMIT = "200";
	
	const QUERY_PARAM_SORT_ORDER = "sort_order";
	const QUERY_PARAM_SORT_BY = "sort_by";
	const QUERY_PARAM_LIMIT = "limit";
	const QUERY_PARAM_OFFSET = "offset";
	const QUERY_PARAM_SEARCH_KEYWORD = "search_keyword";
	const QUERY_PARAM_FIELDS = "fields";
	const QUERY_PARAM_FIELD_SEARCH = "field_search";
	
	const API_CUSTOM_PARAM_RESOURCE_COUNT = "x-resource-count";
	const API_CUSTOM_PARAM_CURRENT_OFFSET = "x-current-offset";
	const API_CUSTOM_PARAM_MAX_PAGE_SIZE = "x-max-page-size";
	const API_CUSTOM_PARAM_RESOURCE_LIST = "x-resource-list";
	const API_CUSTOM_PARAM_IMAGE_COUNT = "x-image-count";
	const API_CUSTOM_PARAM_VIDEO_COUNT = "x-video-count";
	
	const SORTING_ORDER_ASCENDING = "ASC";
	const SORTING_ORDER_DESCENDING = "DESC";
	
	const UPLOAD_TYPE_PROFILE_IMAGE = "PROFILE_IMAGE";
	const UPLOAD_TYPE_MEDIA = "MEDIA";
	const UPLOAD_TYPE_THUMBNAIL = "MEDIA_THUMBNAIL";
	const UPLOAD_TYPE_PROFILE_IMAGE_THUMBNAIL = "PROFILE_IMAGE_THUMBNAIL";
	const UPLOAD_TYPE_AUDIO = "AUDIO";
}