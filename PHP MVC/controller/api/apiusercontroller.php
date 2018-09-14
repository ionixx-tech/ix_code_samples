<?php

namespace controller\api;

use utilities\constant\ApiResponseConstant;
use utilities\constant\ListFieldConstant;
use utilities\constant\ResponseConstant;
use utilities\Headerinfo;
use utilities\Logger;
use utilities\UtilityMethods;
use validator\Listvalidator;
use validator\uservalidator;
use utilities\constant\CommonConstant;

class ApiUserController extends Controller {
	
	public function get($action_identifier = NULL) {
		if (empty ( $action_identifier )) {
			$this->_getAll ();
		}
		elseif(is_array($action_identifier) && count($action_identifier) == 2) {
			if(UtilityMethods::isEqual($action_identifier[1], "following-user")){
				$this->_getFollowingUser($action_identifier[0]);
			}
		}
		elseif(is_string($action_identifier)) {
			if(UtilityMethods::isEqual($action_identifier, "profile-image")){
				$this->_get_user_profile_image ( );
			}
			$this->_getDetails ( $action_identifier );
		}
		$this->dispatch_failure ( ResponseConstant::HTTP_NOT_FOUND );
	}
	
	public function post($action_identifier = NULL) {
		if(isset($action_identifier[1]) && UtilityMethods::isEqual($action_identifier[1], "follow")){
			$this->_follow_user ($action_identifier[0]);
		}
		else if(isset($action_identifier[1]) && UtilityMethods::isEqual($action_identifier[1], "unfollow")){
			$this->_unfollow_user ($action_identifier[0]);
		}
		else if(UtilityMethods::isEqual($action_identifier, "dubuqu-user")){
			$this->_get_dubuqu_user_list ();
		}
		$this->dispatch_failure ( ResponseConstant::HTTP_NOT_FOUND );
	}
	
	public function put($action_identifier = NULL) {
		if (is_array( $action_identifier ) && UtilityMethods::isEqual($action_identifier[1], "profile-image")) {
			if(UtilityMethods::isNotEqual($action_identifier[0], Headerinfo::getValue("user_identifier"))){
				$this->dispatch_failure(ApiResponseConstant::USER_CANNOT_UPDATE_OTHERS_INFO);
			}
			$this->_update_profile_image ( $action_identifier[0] );
		}
		if (!empty ( $action_identifier )) {
			if(UtilityMethods::isNotEqual($action_identifier, Headerinfo::getValue("user_identifier"))){
				$this->dispatch_failure(ApiResponseConstant::USER_CANNOT_UPDATE_OTHERS_INFO);
			}
			$this->_update ( $action_identifier );
		}
		$this->dispatch_failure ( ResponseConstant::HTTP_NOT_FOUND );
	}
	
	public function delete($action_identifier = NULL) {
		$this->dispatch_failure ( ResponseConstant::HTTP_NOT_FOUND );
	}
	
	/**
	 * @api {get} /user/ 4. Search Users
	 * @apiName Search Users
	 * @apiDescription This API is used to fetch user's public information.
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} search_keyword The collection response will be filtered based on this String value.
	 *
	 * @apiSuccessExample Request-Response
	 * Request:
	 *
	 * {
	 * 	"search_keyword": "john"
	 * }
	 *
	   HTTP/1.1 200 OK
	   [
		   {
			 "user_name": "John kanady",
			 "user_identifier": "Sy0Baa4woiWfdsA",
			 "profile_image": ""
		   },
		   {
			 "user_name": "John Abraham",
			 "user_identifier": "Sy0Baa4woiWfdsB",
			 "profile_image": ""
		   }
	   ]
	 
	 *
	 * @apiError 1051 Validation errors
	 * @apiError 1052 Missing required parameter
	 *
	 * @apiErrorExample Error-Request
	 *
	 * Request:
	 {
	 }
	 *
	 * Response:
	 *
	 HTTP/1.1 400 Bad request
	 {
		 "code": 1051,
		 "message": "Validation error",
		 "errors": [
			 {
				 "code": 1052,
				 "description": "Missing required parameter.",
				 "field": "search_word"
			 }
		 ]
	 }
	 *
	 */
	private function _getAll() {
		$this->_request ['field_list'] = ListFieldConstant::USER_LIST_FIELDS;
		$this->check_validator_response ( ListValidator::validate_list ( $this->_request ) );
		$this->check_validator_response ( UserValidator::validate_user_list( $this->_request, CommonConstant::ACTION_TYPE_GET_LIST) );
		try {
			$response = $this->_facade->getAll ( $this->_request );
			$this->check_error_response ( $response );
			$this->dispatch_success ( $response );
		} catch ( \Exception $e ) {
			Logger::error ( 'Get All Failed - user', $e );
			$this->dispatch_failure ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}

	private function _getDetails($user_identifier) {
		try {
			$response = $this->_facade->getDetails ( $user_identifier, UtilityMethods::isEqual(Headerinfo::getValue("user_identifier"), $user_identifier));
			$this->check_error_response ( $response );
			$this->dispatch_success ( $response );
		} catch ( \Exception $e ) {
			Logger::error ( 'Get Details Failed - user', $e );
			$this->dispatch_failure ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}
	
	/**
	 * @api {get} /user/profile-image 7. Get User Profile Image
	 * @apiName Get User Profile Image
	 * @apiDescription This API is used to fetch actual user profile image (Full size image). 
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 * 
	 * @apiSuccess {String} profile_image It contains S3 public profile image URL
	 *
	 * @apiSuccessExample Request-Response1
	 Request:
	 
	 {
	 }
	 
	 Response:
	 
	 HTTP/1.1 200 OK
	 {
		 "profile_image": "https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/profileimage/c51ce410c124a10e0db5e4b97fc2af39.png"
	 }
	 
	 * @apiSuccessExample Request-Response2
	 Request:
	 
	 {
	 }
	 
	 Response:
	 
	 HTTP/1.1 200 OK
	 {
		 "profile_image": ""
	 }
	 
	 *
	 */
	private function _get_user_profile_image() {
		try {
			$response = $this->_facade->get_profile_image();
			$this->check_error_response ( $response );
			$this->dispatch_success ( $response );
		} catch ( \Exception $e ) {
			Logger::error ( 'Get Details Failed - user', $e );
			$this->dispatch_failure ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}
	
	/**
	 * @api {put} /user/ 8. Update User Details
	 * @apiName Update User
	 * @apiDescription This API is used to update the user information
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 *
	 * @apiSuccessExample Request-Response
	 Request:
	 
	 {
		 "user_name": "John kanady",
		 "email_id": "jonh.kanady@test.com",
		 "memory_retain": "true",
		 "device_notification_key": "0c39999d6f9700c91e54c9"
	 }
	 
	 Response:
	 
	 HTTP/1.1 200 OK
	 {
	 }
	 */
	private function _update($action_identifier) {
		try {
			$user_identifier = $action_identifier;
			$response = $this->_facade->update ( $user_identifier, $this->_request );
			$this->check_error_response ( $response );
			$this->dispatch_success ( $response );
		} catch ( \Exception $e ) {
			Logger::error ( 'Update Failed - user', $e );
			$this->dispatch_failure ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}
	

	
	/**
	 * @apiDefine User_fieldlist
	 *
	 * @apiParam {String{45}} user_name Name of the User.
	 * @apiParam {String{3}} country_code Country code of the user.
	 * @apiParam {String{15}} mobile_number Mobile number of the user.
	 * @apiParam {String{100}} email_id  Email ID of the User.
	 * @apiParam {String="male","female"} gender  Gender of the User.
	 * @apiParam {String{45}} device_notification_key  Notification key for the android or ios device to send the push notification.
	 * @apiParam {String{45}} device_id  IMEI/MAC number of the device for identification.
	 * @apiParam {String="android","ios"} device_type  Type of the device
	 * @apiParam {Number{4}} verification_code  Verification code received from user mobile via SMS.
	 *
	 */
	
	/**
	 * @api {post} /user/ 3. Create User
	 * @apiName CreateUser
	 * @apiDescription This API is used for registering user to Dubuqu application.
	 * @apiGroup UserRegistration
	 * @apiVersion 1.0.0
	 *
	 * @apiUse User_fieldlist
	 *
	 * @apiSuccess {String} user_identifier Unique identifier for the user. This needs to send for all APIs in header for which API request will be processed.
	 * @apiSuccess {String} secret_key This is the private key used to generate hash based message authentication code to authenticate the request payload.
	 *
	 * @apiSuccessExample Request-Response
	 *
	 Request:
	 
	 {
		 "user_name": "John kanady",
		 "country_code": "91",
		 "mobile_number": "9876543210",
		 "email_id": "jonh.kanady@test.com",
		 "gender": "male",
		 "device_notification_key": "xd123dedee97987",
		 "device_id": "112232122245664",
		 "device_type": "android",
		 "verification_code": "1234"
	 }
	 
	 Response:
	 
	 HTTP/1.1 200 OK
	 {
	 	"user_identifier": "Sy0Baa4woiWfdsA",
	 	"secret_key": "asdfsdfsaferter4564575745"
	 }
	 *
	 * @apiError 1051 Validation errors
	 * @apiError 1052 Missing required parameter
	 * @apiError 1053 Invalid parameter value
	 * @apiError 1054 Maximum characters length exceeded
	 * @apiError 1055 Minimum characters length exceeded
	 * @apiError 1103 Mobile number already registered
	 *
	 * @apiErrorExample Error-Request1
	 *
	 * Request:
	 
	 {
		 "user_name":"John kanady",
		 "country_code":"",
		 "mobile_number":"",
		 "email_id":".",
		 "device_id":"",
		 "device_type":""
	 }
	 *
	 * Response:
	 *
	 HTTP/1.1 400 Bad request
	 {
		 "code": 1051,
		 "message": "Validation error",
		 "errors": [
			 {
				 "code": 1052,
				 "description": "Missing required parameter.",
				 "field": "country_code"
			 },
			 {
				 "code": 1053,
				 "description": "Invalid parameter value.",
				 "field": "email_id"
			 },
			 {
				 "code": 1052,
				 "description": "Missing required parameter",
				 "field": "mobile_number"
			 },
			 {
				 "code": 1052,
				 "description": "Missing required parameter",
				 "field": "device_notification_key"
			 },
			 {
				 "code": 1052,
				 "description": "Missing required parameter",
				 "field": "device_id"
			 },
			 {
				 "code": 1052,
				 "description": "Missing required parameter",
				 "field": "device_type"
			 },
			 {
				 "code": 1052,
				 "description": "Missing required parameter",
				 "field": "verification_code"
			 }
		 ]
	 }
	 
	 * @apiErrorExample Error-Request2
	 *
	 * Request:
	 
	 {
		 "user_name":"John kanady",
		 "country_code":"91",
		 "mobile_number":"9876543210",
		 "email_id":"John.kanady@test.com",
		 "profile_image":"",
		 "device_id":"987987987987654654",
		 "device_type":"ios",
		 "verification_code": "1234"
	 }
	 *
	 * Response:
	 *
	 HTTP/1.1 400 Bad request
	 {
		 "code": 1103,
		 "message": "Mobile number with requested device ID already registered",
	 }
	 */

	public function authenticate() {
		try {
			$response = $this->_facade->authenticate( $this->_request );
			$this->check_error_response ( $response );
			$this->dispatch_success ( $response );
		} catch ( \Exception $e ) {
			Logger::error ( 'Create Failed - user', $e );
			$this->dispatch_failure ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}
	
	/**
	 * @api {post} /user/:user_identifier/follow 1. Follow user
	 * @apiName Follow User
	 * @apiDescription This API is used to following the user
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} user_identifier Users unique identifier for user who is being followed.
	 *
	 * @apiSuccessExample Request-Response
	 Request:
	 
	 {
	 }
	 
	 Response:
	 
	 HTTP/1.1 200 OK
	 {
	 }
	 
	 * @apiError 2000 User not exist
	 *
	 * * @apiErrorExample Error-Request
	 *
	 * Request:
	 
	 {
	 }
	 *
	 * Response:
	 *
	 HTTP/1.1 400 Bad request
	 {
		 "code": 2000,
		 "message": "User not exist",
	 }
	 *
	 */
	private function _follow_user($follow_user_identifier) {
		try {
			if(UtilityMethods::isEqual(Headerinfo::getValue("user_identifier"), $follow_user_identifier)){
				$this->dispatch_failure(ApiResponseConstant::USER_CANNOT_FOLLOW_UNFOLLOW_SELF);
			}
			$response = $this->_facade->follow_user( Headerinfo::getValue("user_id"), $follow_user_identifier);
			$this->check_error_response ( $response );
			$this->dispatch_success ( $response );
		} catch ( \Exception $e ) {
			Logger::error ( 'Update Failed - user', $e );
			$this->dispatch_failure ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}
	
	/**
	 * @api {post} /user/:user_identifier/unfollow 2. Unfollow user
	 * @apiName Unfollow User
	 * @apiDescription This API is used to unfollowing the user
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} user_identifier Users unique identifier for user who follows.
	 *
	 * @apiSuccessExample Request-Response
	 Request:
	 
	 {
	 }
	 
	 Response:
	 
	 HTTP/1.1 200 OK
	 {
	 }
	 
	 * @apiError 2000 User not exist
	 *
	 * * @apiErrorExample Error-Request
	 *
	 * Request:
	 
	 {
	 }
	 *
	 * Response:
	 *
	 HTTP/1.1 400 Bad request
	 {
		 "code": 2000,
		 "message": "User not exist",
	 }
	 *
	 */
	private function _unfollow_user($follow_user_identifier) {
		try {
			if(UtilityMethods::isEqual(Headerinfo::getValue("user_identifier"), $follow_user_identifier)){
				$this->dispatch_failure(ApiResponseConstant::USER_CANNOT_FOLLOW_UNFOLLOW_SELF);
			}
			$response = $this->_facade->unfollow_user( Headerinfo::getValue("user_id"), $follow_user_identifier);
			$this->check_error_response ( $response );
			$this->dispatch_success ( $response );
		} catch ( \Exception $e ) {
			Logger::error ( 'Update Failed - user', $e );
			$this->dispatch_failure ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}
	
	/**
	 * @api {get} /user/:user_identifier/following-user 3. Get following user details
	 * @apiName Get following user details
	 * @apiDescription This API is used to get following details by user identifier
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 *
	 * @apiSuccessExample Response
	 HTTP/1.1 200 OK
	 [
		 {
			 "user_identifier": "Sy0Baa4woiWfdsA",
			 "user_name": "John kanady",
			 "profile_image": ""
		 },
		 {
			 "user_identifier": "Sy0Baa4woiWfdsB",
			 "user_name": "Abraham",
			 "profile_image": ""
		 }
	 ]
	 *
	 */
	private function _getFollowingUser($action_identifier) {
		$this->_request ['field_list'] = ListFieldConstant::USER_LIST_FIELDS;
		$this->check_validator_response ( ListValidator::validate_list ( $this->_request ) );
		try {
			$response = $this->_facade->get_following_user( $action_identifier, $this->_request );
			$this->check_error_response ( $response );
			$this->dispatch_success ( $response );
		} catch ( \Exception $e ) {
			Logger::error ( 'Get following user Failed', $e );
			$this->dispatch_failure ( ApiResponseConstant::UNKNOWN_ERROR_OCCURRED );
		}
	}
	
	/**
	 * @api {get} /check-update/:latest_version_code 3. Check Updates
	 * @apiName Check Updates
	 * @apiDescription This API is used to check updates
	 * @apiGroup Common
	 * @apiVersion 1.0.0
	 *
	 *  * @apiSuccessExample Response
	 HTTP/1.1 200 OK
	 {
		  "force_update_available": "true",
		  "update_available": "true",
		  "latest_version_code": 1,
		  "latest_version": "1.0.1"
	  }
	 *
	 */
	public function check_update($current_version){
		try {
			$response = $this->_facade->check_update($current_version);
			$this->check_error_response($response);
			$this->dispatch_success($response);
		}catch(\Exception $e){
			Logger::error ( 'Get details Failed - check_update', $e );
			$this->dispatch_failure(ApiResponseConstant::UNKNOWN_ERROR_OCCURRED);
		}
	}
}