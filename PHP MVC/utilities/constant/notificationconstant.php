<?php

namespace utilities\constant;

class NotificationConstant {
	
	const DEVICE_CHANGE_NOTIFICATION_TITLE = "Device changed";
	const DEVICE_CHANGE_NOTIFICATION_MSG = "App registered on new device";
	const DEVICE_CHANGE_NOTIFICATION_TYPE = "DEVICE_CHANGED";
	
	const FOLLOW_USER_NOTIFICATION_TITLE = "Follow user";
	const FOLLOW_USER_NOTIFICATION_MSG = "##USERNAME## started following you";
	const FOLLOW_USER_NOTIFICATION_TYPE = "FOLLOW_USER";
	
	const SOCIAL_CIRCLE_NOTIFICATION_TITLE = "Social circle";
	const SOCIAL_CIRCLE_NOTIFICATION_TYPE = "SOCIAL_CIRCLE";
	const SOCIAL_CIRCLE_NOTIFICATION_MSG = "##USERNAME## added you for post medias in a social circle";
	const SOCIAL_CIRCLE_UPDATED_CLOSED_NOTIFICATION_MSG = "##USERNAME## updated open social group to closed";
	const SOCIAL_CIRCLE_UPDATED_OPEN_NOTIFICATION_MSG = "##USERNAME## updated closed social group to open for post medias";
	
	const MEDIA_SHARE_NOTIFICATION_TITLE = "Shared media";
	const MEDIA_SHARE_NOTIFICATION_MSG = "##USERNAME## shared media(s) with you";
	const MEDIA_SHARE_NOTIFICATION_TYPE = "SHARED_MEDIA";
	
	const PUBLIC_MEDIA_SHARE_NOTIFICATION_TITLE = "Public shared media";
	const PUBLIC_MEDIA_SHARE_NOTIFICATION_MSG = "##USERNAME## posted new media publicly";
	const PUBLIC_MEDIA_SHARE_NOTIFICATION_TYPE = "PUBLIC_SHARED_MEDIA";
	
	const MEDIA_LIKE_NOTIFICATION_TITLE = "Like media";
	const MEDIA_LIKE_NOTIFICATION_MSG = "##USERNAME## liked your media";
	const MEDIA_LIKE_NOTIFICATION_TYPE = "LIKE_MEDIA";
	
	const MEDIA_COMMENT_NOTIFICATION_TITLE = "Comment media";
	const MEDIA_COMMENT_NOTIFICATION_MSG = "##USERNAME## commented on your media";
	const MEDIA_COMMENT_NOTIFICATION_TYPE = "COMMENT_MEDIA";
	
	const COMMENT_LIKE_NOTIFICATION_TITLE = "Like comment";
	const COMMENT_LIKE_NOTIFICATION_MSG = "##USERNAME## liked your comment";
	const COMMENT_LIKE_NOTIFICATION_TYPE = "LIKE_COMMENT";
	
}