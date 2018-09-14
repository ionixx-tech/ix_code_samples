<?php

namespace validator;

use utilities\Logger;
use utilities\constant\InputFieldLengthConstant;
use utilities\Constant\UserConstant;
use utilities\constant\CommonConstant;

class UserValidator {
	
	// method to valid login parameters
	public static function validate_login_parameters($parameter_array, $action_type) {
		try {
			$validator = new CommonValidator ();
			$validation_rule = [
					"username" => [
							"add" => "required",
							"common" => "empty|max_len," . InputFieldLengthConstant::USER_USER_NAME_MAX_LENGTH
					],
					"password" => [
							"add" => "required",
							"common" => "empty|max_len," . InputFieldLengthConstant::USER_USER_NAME_MAX_LENGTH
					],
			];
			$validator->set_validation_rules ( $validation_rule, $action_type);
			return $validator->run ( $parameter_array, FALSE );
		} catch ( \Exception $e ) {
			Logger::error ( 'Validation Failed - user', $e );
			throw $e;
		}
	}
	
	
	// method to valid listing public profile list input parameters
	public static function validate_user_list($parameter_array, $action_type) {
		try {
			$validator = new CommonValidator ();
			$validation_rule = [ 
					"search_keyword" => [ 
							"get_list" => "required|empty" 
					] 
			];
			$validator->set_validation_rules ( $validation_rule, $action_type);
			return $validator->run ( $parameter_array, FALSE );
		} catch ( \Exception $e ) {
			Logger::error ( 'Validation Failed - user', $e );
			throw $e;
		}
	}
	
	// method to valid register ot update profile input parameters
	public static function validate_user($parameter_array, $action_type) {
		try {
			$validator = new CommonValidator ();
			$validation_rule = [
					"user_name" => [
							"add" => "required",
							"common" => "empty|max_len," . InputFieldLengthConstant::USER_USER_NAME_MAX_LENGTH
					],
					"country_code" => [
							"add" => "required",
							"common" => "empty|max_len," . InputFieldLengthConstant::USER_COUNTRY_CODE_MAX_LENGTH
					],
					"mobile_number" => [
							"add" => "required",
							"common" => "empty|mobile_number|max_len," . InputFieldLengthConstant::USER_MOBILE_NUMBER_MAX_LENGTH
					],
					"email_id" => [
							"common" => "empty|max_len," . InputFieldLengthConstant::USER_EMAIL_ADDRESS_MAX_LENGTH. "|valid_email",
					],
					"gender" => [
							"add" => "required",
							"common" => "empty|containsList," . UserConstant::GENDER_MALE. ";" . UserConstant::GENDER_FEMALE
					],
					"device_notification_key" => [
							"add" => "required",
							"common" => "empty|max_len," . InputFieldLengthConstant::USER_DEVICE_NOTIFICATION_KEY_MAX_LENGTH
					],
					"device_id" => [
							"add" => "required",
							"common" => "empty|max_len," . InputFieldLengthConstant::USER_DEVICE_ID_MAX_LENGTH
					],
					"device_type" => [
							"add" => "required",
							"common" => "empty|containsList," . UserConstant::DEVICE_TYPE_ANDROID . ";" . UserConstant::DEVICE_TYPE_IOS
					],
					'verification_code' => [
							'add' => 'required',
							'common' =>'empty|numeric|max_len,' . InputFieldLengthConstant::USER_VERIFICATION_CODE_MAX_LENGTH
					],
					"memory_retain" => [
							"common" => "empty|containsList," . CommonConstant::API_PARAM_FALSE. ";" . CommonConstant::API_PARAM_TRUE
					],
			];
			static::validate_callback ( $parameter_array, $action_type, $validation_rule );
			$validator->set_validation_rules ( $validation_rule, $action_type );
			return $validator->run ( $parameter_array, FALSE );
		} catch ( \Exception $e ) {
			Logger::error ( 'Validation Failed - user', $e );
			throw $e;
		}
	}
	
	// method to valid generate OTP to user mobile input parameters
	public static function validate_generate_otp($parameter_array, $action_type) {
		$validator = new CommonValidator();
		$validation_rule=array(
				'country_code' => array(
						'add' => 'required',
						'common' => 'empty'
						. '|numeric'
						. '|max_len,' . InputFieldLengthConstant::USER_COUNTRY_CODE_MAX_LENGTH
				),
				'mobile_number' => array(
						'add' => 'required',
						'common' =>'empty'
						. '|numeric|mobile_number'
						. '|max_len,' . InputFieldLengthConstant::USER_MOBILE_NUMBER_MAX_LENGTH
				)
		);
		static::validate_callback ( $parameter_array, $action_type, $validation_rule );
		$validator->set_validation_rules($validation_rule, $action_type);
		return $validator->run($parameter_array, FALSE);
	}
	
	// method to valid check OTP from user mobile input parameters
	public static function validate_check_otp($parameter_array, $action_type) {
		$validator = new CommonValidator();
		$validation_rule=array(
				'country_code' => array(
						'add' => 'required',
						'common' => 'empty'
						. '|numeric'
						. '|max_len,' . InputFieldLengthConstant::USER_COUNTRY_CODE_MAX_LENGTH
				),
				'mobile_number' => array(
						'add' => 'required',
						'common' =>'empty'
						. '|numeric'
						. '|max_len,' . InputFieldLengthConstant::USER_MOBILE_NUMBER_MAX_LENGTH
				),
				'verification_code' => array(
						'add' => 'required',
						'common' =>'empty'
						. '|numeric'
						. '|max_len,' . InputFieldLengthConstant::USER_VERIFICATION_CODE_MAX_LENGTH
				),
				
		);
		static::validate_callback ( $parameter_array, $action_type, $validation_rule );
		$validator->set_validation_rules($validation_rule,$action_type);
		return $validator->run($parameter_array, FALSE);
	}
	
	// method to valid list dubuqu user list input parameters
	public static function validate_dubuqu_user_list($parameter_array, $action_type) {
		try {
			$validator = new CommonValidator ();
			$validation_rule = [
					"mobile_numbers" => [
							"get_list" => "required|empty|array"
					]
			];
			$validator->set_validation_rules ( $validation_rule, $action_type);
			return $validator->run ( $parameter_array, FALSE );
		} catch ( \Exception $e ) {
			Logger::error ( 'Validation Failed - user', $e );
			throw $e;
		}
	}
	
	public static function validate_callback($parameter_array, $action_type, $validation_rule) {
		
	}
}