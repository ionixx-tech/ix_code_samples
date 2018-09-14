<?php

namespace utilities\constant;

class ListfieldConstant {
	
	const SOCIAL_GROUP_LIST_FIELDS = [ 
			"group_name",
			"group_type",
			"member_count",
			"group_identifier",
			"profile_image_identifier"
	];
	
	const LIKE_LIST_FIELDS = [ 
			"user_identifier",
			"user_name",
			"profile_image_identifier"
	];
	
	const MEDIA_SHARE_LIST_FIELDS = [
			"signed_url",
			"media_identifier",
			"user_identifier"
	];
	
	const COMMENT_LIST_FIELDS = [ 
			"comment_identifier",
			"comment_type",
			"user_identifier",
			"user_name",
			"comment",
			"profile_image_identifier" 
	];
	
	const MEDIA_LIST_FIELDS = [ 
			"media_identifier",
			"content_type",
			"comment_count",
			"signed_url"
	];
	
	const USER_LIST_FIELDS = [ 
			"user_name",
			"user_identifier",
			"profile_image_identifier"
	];
	
}