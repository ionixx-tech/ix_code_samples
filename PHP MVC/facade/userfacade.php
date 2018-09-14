<?php

namespace facade;

use dao\MobileVerificationDao;
use Dao\UserDao;
use dao\UserFollowDao;
use utilities\constant\ApiResponseConstant;
use utilities\constant\CommonConstant;
use utilities\constant\ListfieldConstant;
use utilities\constant\NotificationConstant;
use utilities\constant\PageLimitConstant;
use utilities\constant\UserConstant;
use utilities\DbConnector;
use utilities\Logger;
use utilities\smsUtility;
use utilities\UtilityMethods;
use validator\UserValidator;
use dao\MediaDao;
use utilities\constant\MediaConstant;
use utilities\Headerinfo;
use dao\AppVersionDao;

class UserFacade extends Facade {
	
	/**
	 * User Login authentication
	 */
	public function authenticate($parameter) {
		$connection = DbConnector::getConnection ();
		$begin_transaction = false;
		try {
			$errors = UserValidator::validate_login_parameters($parameter, CommonConstant::ACTION_TYPE_UPDATE );
			if (UtilityMethods::check_error_exist ( $errors )) {
				return $errors;
			}
			
			$user_details = UserDao::authenticate($connection, $parameter);
			if(empty($user_details)){
				return $this->_build_error_response ( ApiResponseConstant::INVALID_CREDENTIAL );
			}else{
				$token = "";
				while(1){
					$token = UtilityMethods::generate_auth_token($parameter['username']);
					if(UserDao::check_authtoken_exist($connection, $token)){
						sleep(1);
						continue;
					}
					break;
				}
				$data['auth_token'] = $token;					
				$data['user_id'] = strtoupper($user_details['user_id']);
				UserDao::insert_user_token_info($connection,$data);
				unset($data['user_id']);
				$data['username']= $user_details['username'];
				return $data;
			}		
			
			
		} catch ( \Exception $e ) {
			Logger::error ( 'Login Failed - user', $e );
			return $this->_build_error_response ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}
	
	
	public function getAll($filter) {
		$connection = DbConnector::getConnection ();
		try {
			$response = [ ];
			$filter [CommonConstant::QUERY_PARAM_SEARCH_KEYWORD] = UtilityMethods::get_value_from_array ( $filter, CommonConstant::QUERY_PARAM_SEARCH_KEYWORD, '' );
			$filter [CommonConstant::QUERY_PARAM_LIMIT] = UtilityMethods::getPageLimit ( $filter, PageLimitConstant::USER_LIST_MAX_LIMIT);
			$filter [CommonConstant::QUERY_PARAM_OFFSET] = UtilityMethods::get_value_from_array ( $filter, CommonConstant::QUERY_PARAM_OFFSET, 0 );
			$filter [CommonConstant::QUERY_PARAM_SORT_BY] = UtilityMethods::get_value_from_array ( $filter, CommonConstant::QUERY_PARAM_SORT_BY );
			$filter [CommonConstant::QUERY_PARAM_SORT_ORDER] = UtilityMethods::get_value_from_array ( $filter, CommonConstant::QUERY_PARAM_SORT_ORDER );
			$filter [CommonConstant::QUERY_PARAM_FIELDS] = UtilityMethods::get_value_from_array ( $filter, CommonConstant::QUERY_PARAM_FIELDS, implode(",", ListfieldConstant::USER_LIST_FIELDS));
			$filter [CommonConstant::QUERY_PARAM_FIELD_SEARCH] = UtilityMethods::get_value_from_array ( $filter, CommonConstant::QUERY_PARAM_FIELD_SEARCH, '' );
			
			$user_list = UserDao::get_all ( $connection, $filter );
			$user_count = UserDao::get_all ( $connection, $filter, true );
			
			if(UtilityMethods::isNotEmpty($user_list)){
				foreach ($user_list as &$user){
					$user["profile_image"] = "";
					if(UtilityMethods::isNotEmpty($user["profile_image_identifier"])){
						$user["profile_image"] = $this->_s3_storage->createPublicURLForGet(MediaConstant::THUMBNAIL_FILE_EXTENSION, $user["profile_image_identifier"]);
					}
					unset($user["profile_image_identifier"]);
				}
			}
			
			$response [CommonConstant::API_CUSTOM_PARAM_RESOURCE_LIST] = $user_list;
			$response [CommonConstant::API_CUSTOM_PARAM_RESOURCE_COUNT] = $user_count;
			$response [CommonConstant::API_CUSTOM_PARAM_MAX_PAGE_SIZE] = PageLimitConstant::USER_LIST_MAX_LIMIT;
			$response [CommonConstant::API_CUSTOM_PARAM_CURRENT_OFFSET] = $filter [CommonConstant::QUERY_PARAM_OFFSET];
			return $response;
		} catch ( \Exception $e ) {
			Logger::error ( 'Get List Failed - user', $e );
			return $this->_build_error_response ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		} finally {
			DbConnector::closeConnection();
		}
	}
	
	/**
	 * 7.6 Profile View
	 * method to fetch single full user details by identifier
	 * 
	 * @param array $user_identifier
	 * @param boolean $self_info
	 * @return array
	 */
	public function getDetails($user_identifier, $self_info) {
		$connection = DbConnector::getConnection ();
		try {
			$user_id = UserDao::get_user_id ( $connection, $user_identifier );
			if (empty ( $user_id )) {
				return $this->_build_error_response ( ApiResponseConstant::USER_NOT_EXIST );
			}
			
			$response = UserDao::getDetails ( $connection, $user_id, $self_info );
			$response["profile_image"] = "";
			if(UtilityMethods::isNotEmpty($response["profile_image_identifier"])){
				$response["profile_image"] = $this->_s3_storage->createPublicURLForGet(MediaConstant::THUMBNAIL_FILE_EXTENSION, $response["profile_image_identifier"]);
			}
			unset($response["profile_image_identifier"]);
			
			if(!$self_info){
				$response["is_following"] = "false";
				if(UserFollowDao::check_record_exist($connection, Headerinfo::getValue("user_id"), $user_id)){
					$response["is_following"] = "true";
				}
			}
			return $response;
		} catch ( \Exception $e ) {
			Logger::error ( 'Get Details Failed - user', $e );
			return $this->_build_error_response ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		} finally {
			DbConnector::closeConnection();
		}
	}
	
	/**
	 * 2.2 Registration
	 * method to insert new user on registration page 
	 * 
	 * @param input array $parameter
	 * @return array
	 */
	public function insert($parameter) {
		$connection = DbConnector::getConnection ();
		$begin_transaction = false;
		try {
			$errors = UserValidator::validate_user ( $parameter, CommonConstant::ACTION_TYPE_ADD );
			if (UtilityMethods::check_error_exist ( $errors )) {
				return $errors;
			}
			
			$verification_code_expiry_time = MobileVerificationDao::check_verification_code($connection, $parameter);
			if(empty($verification_code_expiry_time)){
				return $this->_build_error_response(ApiResponseConstant::USER_REGISTRATION_INVALID_VERIFICATION_CODE);
			}
			if(UtilityMethods::is_time_exceed($verification_code_expiry_time, VERIFICATION_CODE_EXPIRY_TIME_IN_MINUTE)){
				return $this->_build_error_response(ApiResponseConstant::USER_REGISTRATION_VERIFICATION_CODE_EXPIRED);
			}
			
			$is_registered_user = false; $delete_user = false;
			$secret_key = null;
			$mobile_number = $parameter["country_code"].$parameter["mobile_number"];
			$registered_user = UserDao::get_user_details_by_mobile_number($connection, $mobile_number);
			if(UtilityMethods::isNotEmpty($registered_user)){
				$secret_key = md5 ( time () . $registered_user["user_identifier"]);
				$is_registered_user = true;
			}
			else {
				$registered_device = UserDao::get_user_details_for_validate($connection, $parameter["device_notification_key"], $parameter["device_id"]);
				if(UtilityMethods::isNotEmpty($registered_device)){
					$delete_user = true;
				}
			}
			
			$parameter["gender"] = (UtilityMethods::isEqual($parameter["gender"], UserConstant::GENDER_MALE, true)) ? UserConstant::GENDER_MALE_DB_VALUE: UserConstant::GENDER_FEMALE_DB_VALUE;
			$parameter ['email_id'] = UtilityMethods::get_value_from_array ( $parameter, 'email_id', null );
			
			DbConnector::beginTransaction ( $connection );
			$begin_transaction = true;
			
			if($is_registered_user){
				
				if(UtilityMethods::isNotEqual($parameter["device_id"], $registered_user["device_id"])){
					// send push notification to old mobile for warning or mobile development notify
					$notification['title'] = "Device changed";
					$notification['data']["message"] = "Device already registered with requested mobile number";
					$notification['data']['type'] = NotificationConstant::DEVICE_CHANGE_NOTIFICATION_TYPE;
					$this->_notifyUser($notification, $registered_user["device_notification_key"], $registered_user["device_type"]);
				}
				
				$parameter["secret_key"] = $secret_key;
				
				$update_parameter = [];
				$update_fields = array('user_name','mobile_number','country_code','email_id','gender','device_id','device_notification_key','device_type','secret_key');
				UtilityMethods::build_update_parameter($parameter, $update_parameter, $update_fields);
				$update_parameter['delete_status'] = 0;
				if(count($update_parameter) > 0){
					$primary_key_details = ["user_id" => $registered_user["user_id"]];
					UserDao::updateBasedOnGivenKey($connection, 'user', $primary_key_details, $update_parameter, ['last_updated_stamp']);
				}
				$user_identifier = $registered_user["user_identifier"];
			}
			else {
				// generate user_identifier
				do {
					$user_identifier = UtilityMethods::generate_user_identifier();
				}
				while(UserDao::check_user_identifier($connection, $user_identifier) > 0);
				
				if($delete_user){
					UserDao::delete($connection, $registered_user["user_id"]);
				}
				
				$parameter ['user_identifier'] = $user_identifier;
				$secret_key = md5 ( time () . $user_identifier);
				$parameter['secret_key'] = $secret_key;
				
				UserDao::insert ( $connection, $parameter );
			}
			
			DbConnector::commitTransaction ( $connection, true );
			return array("user_identifier"=>$user_identifier, "secret_key"=>$secret_key);
		} catch ( \Exception $e ) {
			if ($begin_transaction) {
				DbConnector::rollbackTransaction ( $connection, true );
			}
			Logger::error ( 'Insert Failed - user', $e );
			return $this->_build_error_response ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}
	
	/**
	 * 7.1 Settings
	 * methos to update user update profile 
	 * 
	 * @param string $user_identifier
	 * @param input array $parameter
	 * @return array
	 */
	public function update($user_identifier, $parameter) {
		$connection = DbConnector::getConnection ();
		$begin_transaction = false;
		try {
			$errors = UserValidator::validate_user ( $parameter, CommonConstant::ACTION_TYPE_UPDATE );
			if (UtilityMethods::check_error_exist ( $errors )) {
				return $errors;
			}
			
			$user_id = UserDao::get_user_id ( $connection, $user_identifier );
			if (empty ( $user_id )) {
				return $this->_build_error_response ( ApiResponseConstant::USER_NOT_EXIST );
			}
			
			if(isset($parameter["memory_retain"])){
				$parameter ['is_memory_retain'] = UtilityMethods::is_parameter_true($parameter ['memory_retain']);
			}
			
			$update_parameter = [ ];
			$update_fields = [ 
					"user_name",
					"email_id",
					"is_memory_retain",
					"device_notification_key"
			];
			UtilityMethods::build_update_parameter ( $parameter, $update_parameter, $update_fields );
			if (count ( $update_parameter ) > 0) {
				DbConnector::beginTransaction ( $connection );
				$begin_transaction = true;
				$primary_key_details = array (
						"user_id" => $user_id 
				);
				UserDao::updateBasedOnGivenKey ( $connection, 'user', $primary_key_details, $update_parameter, ['last_updated_stamp'] );
				DbConnector::commitTransaction ( $connection, true );
			}
			return array ();
		} catch ( \Exception $e ) {
			if ($begin_transaction) {
				DbConnector::rollbackTransaction ( $connection, true );
			}
			Logger::error ( 'Update Failed - user', $e );
			return $this->_build_error_response ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}
	
	/**
	 * 7.1 Settings
	 * method to update user profile image after uploading media to S3
	 * 
	 * @param string $user_identifier
	 * @param input array $parameter
	 * @return array
	 */
	public function update_profile_image($user_identifier, $parameter) {
		$connection = DbConnector::getConnection ();
		$begin_transaction = false;
		try {
			if(!isset($parameter["profile_image_identifier"])){
				$errors["validation_errors"] = array("profile_image_identifier" => ApiResponseConstant::MISSING_REQUIRED_PARAMETERS);
				return $errors;
			}
			
			$user_details = UserDao::get_user_details_by_identifier( $connection, $user_identifier );
			if (empty ( $user_details)) {
				return $this->_build_error_response ( ApiResponseConstant::USER_NOT_EXIST );
			}
			
			if(UtilityMethods::isNotEmpty($parameter["profile_image_identifier"])){
				if(empty(MediaDao::check_media_exist($connection, $parameter["profile_image_identifier"], MediaConstant::MEDIA_TYPE_PROFILE_IMAGE))){
					return $this->_build_error_response ( ApiResponseConstant::PROFILE_IMAGE_NOT_EXIST);
				}
			}
			
			$update_parameter = [ ];
			$update_fields = [
					"profile_image_identifier"
			];
			UtilityMethods::build_update_parameter ( $parameter, $update_parameter, $update_fields );
			if (count ( $update_parameter ) > 0) {
				DbConnector::beginTransaction ( $connection );
				$begin_transaction = true;
				$primary_key_details = array (
						"user_id" => $user_details["user_id"]
				);
				UserDao::updateBasedOnGivenKey ( $connection, 'user', $primary_key_details, $update_parameter, ['last_updated_stamp'] );
				DbConnector::commitTransaction ( $connection );
				$begin_transaction = false;
				
				// remove old image in S3
				if(UtilityMethods::isNotEmpty($user_details["profile_image_identifier"]) && 
						UtilityMethods::isNotEqual($parameter["profile_image_identifier"], $user_details["profile_image_identifier"])){
					$media_details = MediaDao::get_media_details_by_identifier($connection, $user_details["profile_image_identifier"], "media_id, file_extension");
					Logger::debug("REMOVE S3 CALLED FOR PROFILE IMAGE UPDATE. PARAMETER: " . var_export($media_details, true));
					$this->_s3_storage->remove($media_details["file_extension"], $user_details["profile_image_identifier"], MediaConstant::MEDIA_TYPE_PROFILE_IMAGE);
					
					$media_facade = new MediaFacade();
					$media_facade->delete_media($connection, $user_details["profile_image_identifier"], MediaConstant::DELETED_BY_OWNER);
				}
			}
			DbConnector::closeConnection();
			return array ();
		} catch ( \Exception $e ) {
			if ($begin_transaction) {
				DbConnector::rollbackTransaction ( $connection, true );
			}
			Logger::error ( 'Update Failed - update_profile_image', $e );
			return $this->_build_error_response ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}
	
	/**
	 * 7.1 Settings
	 * method to fetch user profile image from S3
	 * 
	 * @return array
	 */
	public function get_profile_image() {
		$connection = DbConnector::getConnection ();
		try {
			$user_details = UserDao::get_details_by_field_string($connection, Headerinfo::getValue("user_id"));
			
			$response["profile_image"] = "";
			if(UtilityMethods::isNotEmpty($user_details["profile_image_identifier"])){
				$media_details = MediaDao::get_media_details_by_identifier($connection, $user_details["profile_image_identifier"], "file_extension");
				$response["profile_image"] = $this->_s3_storage->createPublicURLForGet($media_details["file_extension"], $user_details["profile_image_identifier"], true);
			}
			return $response;
		} catch ( \Exception $e ) {
			Logger::error ( 'Get Details Failed - get_profile_image', $e );
			return $this->_build_error_response ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		} finally {
			DbConnector::closeConnection();
		}
	}
	
	/*
	 * 2.2 Registration
	 * Generate verification code to user's mobile number
	 */
	public function generate_verification_code($parameter) {
		$connection = DbConnector::getConnection();
		try {
			
			$errors = UserValidator::validate_generate_otp( $parameter, CommonConstant::ACTION_TYPE_ADD );
			if (UtilityMethods::check_error_exist ( $errors )) {
				return $errors;
			}
			
			$parameter['country_code'] = filter_var($parameter['country_code'], FILTER_SANITIZE_NUMBER_INT);
				
			if(UtilityMethods::isEnvProduction()){
				$verification_code = UtilityMethods::generate_otp();
				$parameter['vendor'] = "MSG91";
			}else{
				$verification_code = "1234";
				$parameter['vendor'] = "";
			}
				
			DbConnector::beginTransaction($connection);
			MobileVerificationDao::inactive_old_verification_code($connection, $parameter['mobile_number'], $parameter['country_code']);
			$parameter['verification_code'] = $verification_code;
			$mobile_verification_id = MobileVerificationDao::insert($connection, $parameter);
				
			$message = str_replace("##VERIFICATION_CODE##", $verification_code, VERIFICATION_CODE_SMS_TEMPLATE);
			$mobile_number = $parameter['country_code'].$parameter['mobile_number'];
			$sms_id = smsUtility::sendSMS($message, $mobile_number);
				
			if(empty($sms_id)){
				DbConnector::rollbackTransaction($connection, true);
				DbConnector::closeConnection();
				return $this->_build_error_response(ApiResponseConstant::USER_REGISTRATION_UNABLE_TO_SEND_VERIFICATION_CODE);
			}
				
			DbConnector::commitTransaction($connection, true);
			return [];
		}catch(\Exception $e){
			Logger::error("Generating verification code failed.",$e);
			DbConnector::rollbackTransaction($connection, true);
			return $this->_build_error_response(ApiResponseConstant::UNKNOWN_ERROR_OCCURRED);
		}
	}
	
	/**
	 * 2.2 Registration
	 * method to check the user mobile verification code 
	 * 
	 * @param array $parameter
	 * @return array
	 */
	public function check_verification_code($parameter){
		$connection = DbConnector::getConnection();
		try {
			
			$errors = UserValidator::validate_check_otp( $parameter, CommonConstant::ACTION_TYPE_ADD );
			if (UtilityMethods::check_error_exist ( $errors )) {
				return $errors;
			}
	
			$verification_code_expiry_time = MobileVerificationDao::check_verification_code($connection, $parameter);
			if(empty($verification_code_expiry_time)){
				return $this->_build_error_response(ApiResponseConstant::USER_REGISTRATION_INVALID_VERIFICATION_CODE);
			}
			if(UtilityMethods::is_time_exceed($verification_code_expiry_time, VERIFICATION_CODE_EXPIRY_TIME_IN_MINUTE)){
				return $this->_build_error_response(ApiResponseConstant::USER_REGISTRATION_VERIFICATION_CODE_EXPIRED);
			}
			return [];
		} catch(\Exception $e){
			Logger::error("Checking Verification failed.",$e);
			DbConnector::closeConnection();
			return $this->_build_error_response(ApiResponseConstant::UNKNOWN_ERROR_OCCURRED);
		} finally {
			DbConnector::closeConnection();
		}
	}
	
	/**
	 * 6. VAULT
	 * method to follow public profiles
	 * 
	 * @param integer $user_id
	 * @param string $follow_user_identifier
	 * @return array
	 */
	public function follow_user($user_id, $follow_user_identifier) {
		$connection = DbConnector::getConnection ();
		$begin_transaction = false;
		try {
			$follow_user_details = UserDao::get_user_details_by_identifier($connection, $follow_user_identifier);
			if(empty($follow_user_details)){
				return $this->_build_error_response ( ApiResponseConstant::USER_NOT_EXIST );
			}
			
			if(UserFollowDao::check_record_exist($connection, $user_id, $follow_user_details["user_id"]) > 0){
				return $this->_build_error_response ( ApiResponseConstant::USER_ALREADY_FOLLOWED );
			}
			
			$parameter ['followed_user_id'] = $follow_user_details["user_id"];
			$parameter ['follower_user_id'] = $user_id;
			
			DbConnector::beginTransaction ( $connection );
			$begin_transaction = true;
			$user_follow_id = UserFollowDao::insert ( $connection, $parameter );
			DbConnector::commitTransaction ( $connection, true );
			
			$notification['title'] = NotificationConstant::FOLLOW_USER_NOTIFICATION_TITLE;
			$notification['data']["message"] = str_replace("##USERNAME##", Headerinfo::getValue("user_name"), NotificationConstant::FOLLOW_USER_NOTIFICATION_MSG);
			$notification['data']['type'] = NotificationConstant::FOLLOW_USER_NOTIFICATION_TYPE;
			$notification['user_identifier'] = Headerinfo::getValue("user_identifier");
			$this->_notifyUser($notification, $follow_user_details["device_notification_key"], $follow_user_details["device_type"]);
			
			return [];
		} catch ( \Exception $e ) {
			if ($begin_transaction) {
				DbConnector::rollbackTransaction ( $connection, true);
			}
			Logger::error ( 'Insert Failed - user_follow', $e );
			return $this->_build_error_response ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}
	
	/**
	 * 6. VAULT
	 * method to unfollow public profiles
	 * 
	 * @param integer $user_id
	 * @param string $follow_user_identifier
	 * @return array
	 */
	public function unfollow_user($user_id, $follow_user_identifier) {
		$connection = DbConnector::getConnection ();
		$begin_transaction = false;
		try {
			$follow_user_id = UserDao::get_user_id($connection, $follow_user_identifier);
			if(empty($follow_user_id)){
				return $this->_build_error_response ( ApiResponseConstant::USER_NOT_EXIST );
			}
			
			if(UserFollowDao::check_record_exist($connection, $user_id, $follow_user_id) == 0){
				return $this->_build_error_response ( ApiResponseConstant::USER_NOT_FOLLOWED );
			}
			
			$parameter ['followed_user_id'] = $follow_user_id;
			$parameter ['follower_user_id'] = $user_id;
			
			DbConnector::beginTransaction ( $connection );
			$begin_transaction = true;
			$user_follow_id = UserFollowDao::delete ( $connection, $parameter );
			DbConnector::commitTransaction ( $connection, true);
			return [];
		} catch ( \Exception $e ) {
			if ($begin_transaction) {
				DbConnector::rollbackTransaction ( $connection, true);
			}
			Logger::error ( 'Delete Failed - user_follow', $e );
			return $this->_build_error_response ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}
	
	/**
	 * 6. VAULT
	 * method to get following user details by user identifier
	 * 
	 * @param string $user_identifier
	 * @return array
	 */
	public function get_following_user($user_identifier, $filter) {
		$connection = DbConnector::getConnection ();
		try {
			$follower_user_id = UserDao::get_user_id($connection, $user_identifier);
			if(empty($follower_user_id)){
				return $this->_build_error_response ( ApiResponseConstant::USER_NOT_EXIST );
			}
			
			$response = [ ];
			$filter [CommonConstant::QUERY_PARAM_SEARCH_KEYWORD] = UtilityMethods::get_value_from_array ( $filter, CommonConstant::QUERY_PARAM_SEARCH_KEYWORD, '' );
			$filter [CommonConstant::QUERY_PARAM_LIMIT] = UtilityMethods::getPageLimit ( $filter, PageLimitConstant::USER_LIST_MAX_LIMIT);
			$filter [CommonConstant::QUERY_PARAM_OFFSET] = UtilityMethods::get_value_from_array ( $filter, CommonConstant::QUERY_PARAM_OFFSET, 0 );
			$filter [CommonConstant::QUERY_PARAM_SORT_BY] = UtilityMethods::get_value_from_array ( $filter, CommonConstant::QUERY_PARAM_SORT_BY );
			$filter [CommonConstant::QUERY_PARAM_SORT_ORDER] = UtilityMethods::get_value_from_array ( $filter, CommonConstant::QUERY_PARAM_SORT_ORDER );
			$filter [CommonConstant::QUERY_PARAM_FIELDS] = UtilityMethods::get_value_from_array ( $filter, CommonConstant::QUERY_PARAM_FIELDS, '*' );
			$filter [CommonConstant::QUERY_PARAM_FIELD_SEARCH] = UtilityMethods::get_value_from_array ( $filter, CommonConstant::QUERY_PARAM_FIELD_SEARCH, '' );
			
			$following_user_list = UserFollowDao::get_following_user_details($connection, $follower_user_id, $filter); 
			$following_user_count = UserFollowDao::get_following_user_details($connection, $follower_user_id, $filter, true); 
			
			if(UtilityMethods::isNotEmpty($following_user_list)){
				foreach ($following_user_list as &$user){
					$user["profile_image"] = "";
					if(UtilityMethods::isNotEmpty($user["profile_image_identifier"])){
						$user["profile_image"] = $this->_s3_storage->createPublicURLForGet(MediaConstant::THUMBNAIL_FILE_EXTENSION, $user["profile_image_identifier"]);
					}
					unset($user["profile_image_identifier"]);
				}
			}
			
			$response [CommonConstant::API_CUSTOM_PARAM_RESOURCE_LIST] = $following_user_list;
			$response [CommonConstant::API_CUSTOM_PARAM_RESOURCE_COUNT] = $following_user_count;
			$response [CommonConstant::API_CUSTOM_PARAM_MAX_PAGE_SIZE] = PageLimitConstant::USER_LIST_MAX_LIMIT;
			$response [CommonConstant::API_CUSTOM_PARAM_CURRENT_OFFSET] = $filter [CommonConstant::QUERY_PARAM_OFFSET];
			return $response;
		} catch ( \Exception $e ) {
			Logger::error ( 'get_following_user Failed - User', $e );
			return $this->_build_error_response ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		} finally {
			DbConnector::closeConnection();
		}
	}
	
	/**
	 * 3.4 Quick Show/ Share - Get dubuqu user list for sharing media
	 * method to get list od list registered user details by array of mobile numbers
	 * 
	 * @param input array $parameter
	 * @return array
	 */
	public function get_dubuqu_user_list($parameter){
		$connection = DbConnector::getConnection();
		try {
			$errors = UserValidator::validate_dubuqu_user_list( $parameter, CommonConstant::ACTION_TYPE_GET_LIST);
			if (UtilityMethods::check_error_exist ( $errors )) {
				return $errors;
			}
			
			$response = UserDao::get_details_by_mobile_numbers($connection, $parameter["mobile_numbers"]);
			if(UtilityMethods::isNotEmpty($response)){
				foreach ($response as &$user){
					$user["profile_image"] = "";
					if(UtilityMethods::isNotEmpty($user["profile_image_identifier"])){
						$user["profile_image"] = $this->_s3_storage->createPublicURLForGet(MediaConstant::THUMBNAIL_FILE_EXTENSION, $user["profile_image_identifier"]);
					}
					unset($user["profile_image_identifier"]);
				}
			}
			$response [CommonConstant::API_CUSTOM_PARAM_RESOURCE_LIST] = $response;
			$response [CommonConstant::API_CUSTOM_PARAM_RESOURCE_COUNT] = count($response);
			$response [CommonConstant::API_CUSTOM_PARAM_MAX_PAGE_SIZE] = PageLimitConstant::DUBUQU_USER_LIST_MAX_LIMIT;
			$response [CommonConstant::API_CUSTOM_PARAM_CURRENT_OFFSET] = 0;
			
			return $response;
		} catch(\Exception $e){
			Logger::error("get_dubuqu_user_list failed.",$e);
			DbConnector::closeConnection();
			return $this->_build_error_response(ApiResponseConstant::UNKNOWN_ERROR_OCCURRED);
		} finally {
			DbConnector::closeConnection();
		}
	}
	
	/**
	 * method to get current API version for development
	 * 
	 * @param number $current_version
	 * @return array
	 */
	public function check_update ($current_version){
		$connection = DbConnector::getConnection();
		try {
			$response = [
					"force_update_available" => CommonConstant::API_PARAM_FALSE,
					"update_available" => CommonConstant::API_PARAM_FALSE,
			];
			if(AppVersionDao::check_for_force_update($connection, $current_version,1)){
				$response["force_update_available"] = CommonConstant::API_PARAM_TRUE;
				$response["update_available"] = CommonConstant::API_PARAM_TRUE;
			}
			else if(AppVersionDao::check_for_force_update($connection, $current_version,0)){
				$response["update_available"] = CommonConstant::API_PARAM_TRUE;
			}
			$latest_version = AppVersionDao::get_latest_version($connection);
			$response["latest_version_code"] = $latest_version["version_code"];
			$response["latest_version"] = $latest_version["version"];
			
			return $response;
		}catch(\Exception $e){
			Logger::error("Check for update failed.",$e);
			return $this->_build_error_response(ApiResponseConstant::UNKNOWN_ERROR_OCCURRED);
		}finally {
			DbConnector::closeConnection();
		}
	}
}