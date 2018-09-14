<?php

namespace facade;

use utilities\constant\CommonConstant;
use utilities\Logger;

require XEHAR_SERVER_BASE_PATH . 'utilities/filestorage/s3storage.php';

class Facade { 

	protected $_callback;
	protected $_s3_storage;
	
	function __construct($resource = null) {
		if(!empty($resource)){
			$callback = "callback\\".$resource."CallBack";
			if(class_exists($callback)){
				$this->_callback = new $callback(); 
			}	
		}
		$this->_s3_storage = new \S3Storage();
	}
	
	protected function _build_error_response($error_code, $message = null) {
		return array (
				CommonConstant::ERROR_CODE => $error_code,
				CommonConstant::ERROR_MESSAGE => $message 
		);
	}
	
	protected function _notifyUser($notification_details, $recipients, $device_type) {
		$parameter["details"] = $notification_details;
		if(!is_array($recipients)){
			$recipients = array($recipients);
		}
		$recipient_ids_list = array_chunk($recipients, 256);
		$parameter["device_type"] = $device_type;
		
		foreach ($recipient_ids_list  as $recipient_ids){
			$parameter['recipient_ids'] = $recipient_ids;
			Logger::debug("Push Notification Invoked data = ".var_export($parameter, true));
			$syncTaskUrl = INVOKE_PUSH_NOTIFICATION_PATH.' '.base64_encode(serialize($parameter));
			exec('php '.$syncTaskUrl." > /dev/null 2>/dev/null &");
		}
	}
	
	/**
	 * 5.2 User not having DUBUQU app
	 * method to send SMS for shared media details to non-dubuqu user 
	 * 
	 * @param array $mobile_numbers
	 * @param string $message
	 * @param integer $shared_user_id
	 */
	protected function _sendMsgForNonDubuquUsers($mobile_numbers, $message, $shared_user_id) {
		if(empty($mobile_numbers) || count($mobile_numbers) == 0){
			return;
		}
		$parameter["mobile_numbers"] = $mobile_numbers;
		$parameter["message"] = $message;
		$parameter["user_id"] = $shared_user_id;
		
		Logger::debug("Send SMS Invoked data = ".var_export($parameter, true));
		$syncTaskUrl = INVOKE_SEND_SMS_PATH.' '.base64_encode(serialize($parameter));
		exec('php '.$syncTaskUrl." > /dev/null 2>/dev/null &");
		
	}
	
 }