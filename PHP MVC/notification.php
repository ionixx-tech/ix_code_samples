<?php
use utilities\constant\UserConstant;
use utilities\Logger;
use utilities\PushNotificationUtility;
use utilities\UtilityMethods;

require_once 'initiator.php';
$parameter = unserialize(base64_decode($argv[1]));
Logger::debug("Push Notification request received data");

if(UtilityMethods::isEqual($parameter["device_type"], UserConstant::DEVICE_TYPE_ANDROID)){
	PushNotificationUtility::sendAndroidPushNotification($parameter["details"], $parameter["recipient_ids"]);
	return;
}
PushNotificationUtility::sendApnsPushNotification($parameter["details"], $parameter["recipient_ids"]);

