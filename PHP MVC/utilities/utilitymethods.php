<?php

namespace utilities;

use utilities\constant\CommonConstant;

class UtilityMethods {
	
	// method to isNotEqual with $value1 and $value2 as parameters
	public static function isStringNotEqual($value1, $value2, $case_insensitive = false) {
		return ! UtilityMethods::isStringEqual ( $value1, $value2, $case_insensitive );
	}
	//method to generate auth token
	public static function generate_auth_token($username){
		return md5($username.date('Y-m-d H:i:s'));
	}
	
	// method to isNotEqual with $value1 and $value2 as parameters
	public static function isNotEqual($value1, $value2, $case_insensitive = false) {
		return ! UtilityMethods::isEqual ( $value1, $value2, $case_insensitive );
	}
	
	// method to isEmpty with $value1 as parameter
	public static function isEmpty($value1) {
		return (! isset ( $value1 ) || empty ( $value1 ));
	}
	
	public static function isEmptyString($value1) {
		if (! isset ( $value1 )) {
			return true;
		}
		$value1 = trim ( $value1 );
		return empty ( $value1 );
	}
	
	public static function isValueSet($value) {
		return (isset ( $value ));
	}
	
	// method to isEmpty with $value1 as parameter
	public static function isNotEmpty($value1) {
		return ! UtilityMethods::isEmpty ( $value1 );
	}
	
	// method to convertIfNull with $value and $default_value as parameters
	public static function convertIfNull($value, $default_value) {
		return UtilityMethods::isEmpty ( $value ) ? $default_value : $value;
	}
	
	public static function isStringEqual($value1, $value2, $case_insensitive = true) {
		if ($case_insensitive) {
			return (strcasecmp ( $value1, $value2 ) == 0);
		} else {
			return (strcmp ( $value1, $value2 ) == 0);
		}
	}
	
	// method to isEqual with $value1 and $value2 as parameters
	public static function isEqual($value1, $value2, $case_insensitive = false) {
		if (is_string ( $value1 ) && is_string ( $value2 )) {
			return self::isStringEqual ( $value1, $value2, $case_insensitive );
		}
		return $value1 === $value2;
	}
	
	// Method to get the filename without extension
	public static function get_file_without_extension($file_name) {
		$info = pathinfo ( $file_name );
		$file_name = basename ( $file_name, '.' . $info ['extension'] );
		
		return $file_name;
	}
	
	public static function get_file_extension($file_name) {
		$info = pathinfo ( $file_name );
		return $info ['extension'];
	}
	
	// Method to get module name from class name
	public static function check_error_exist($response) {
		if (is_array ( $response ) && isset ( $response [CommonConstant::ERROR_CODE] )) {
			return true;
		} else if (isset ( $response ["validation_errors"] ) && count ( $response ["validation_errors"] ) > 0) {
			return true;
		} else {
			return false;
		}
	}
	
	public static function get_controller($contoller_name) {
		$contoller = '\controller\\api\\api' . $contoller_name . "Controller";
		return new $contoller ( $contoller_name );
	}
	
	public static function get_error_message($error_code, &$replace = '') {
		include_once ERROR_MSG_PATH . 'error_messages.php';
		
		if (array_key_exists ( $error_code, $GLOBALS ['error_message'] )) {
			$error_message = $GLOBALS ['error_message'] [$error_code];
			if (preg_match ( "/" . CommonConstant::FIELD_NAME_PLACE_HOLDER . "/i", $error_message )) {
				$error_message = str_replace ( CommonConstant::FIELD_NAME_PLACE_HOLDER, str_replace ( "-", " ", $replace ), $error_message );
				$replace = null;
			}
			if (preg_match ( "/" . CommonConstant::ERROR_DETIALS . "/i", $error_message )) {
				$error_message = str_replace ( CommonConstant::ERROR_DETIALS, str_replace ( "-", " ", $replace ), $error_message );
			}
			return $error_message;
		} else {
			return false;
		}
	}
	
	public static function build_update_parameter($parameter, &$update_parameter, $update_values = NULL) {
		foreach ( $parameter as $key => $value ) {
			if (! empty ( $update_values ) && ! in_array ( $key, $update_values )) {
				continue;
			}
			$update_parameter [$key] = $value;
		}
	}
	
	public static function get_datetime($offset = NULL, $time = NULL) {
		$dateTime = new \DateTime ( $time );
		if (! empty ( $offset )) {
			$dateTime->modify ( '+' . $offset . ' minutes' );
		}
		return date_format ( $dateTime, 'Y-m-d H:i:s' );
	}
	
	public static function is_time_exceed($time = NULL, $offset = NULL) {
		$startTime = new \DateTime ( $time );
		if (! empty ( $offset )) {
			$startTime->modify ( '+' . $offset . ' minutes' );
		}
		$endTime = new \DateTime ();
		return ($endTime > $startTime);
	}
	
	public static function get_value_from_array($array, $key, $default = NULL) {
		return (is_array ( $array ) && array_key_exists ( $key, $array )) ? $array [$key] : $default;
	}
	
	public static function is_parameter_true($value) {
		return (strtolower ( $value ) == CommonConstant::API_PARAM_TRUE) ? 1 : 0;
	}
	
	public static function is_status_active($value) {
		return (strtolower ( $value ) == CommonConstant::API_STATUS_ACTIVE) ? 1 : 0;
	}
	
	public static function log_error($data) {
		if (! is_string ( $data )) {
			$data = var_export ( $data, true );
		}
		Logger::debug ( $data );
	}
	
	// method to remove non-utf8 character
	public static function removeNonUtf8Character($string) {
		$string = preg_replace ( '/[\xa0]/', '', $string );
		$string = preg_replace ( "/&#?[a-z0-9]{2,8};/i", "", $string );
		return $string;
	}
	
	/*
	 * Method to Bind Error Response @return An Array which contain error code, fields, optional fields and value for the particular response
	 */
	public static function bind_error($error_code, $field = null) {
		$bind_error = array (
				CommonConstant::ERROR_CODE => $error_code,
				CommonConstant::ERROR_MESSAGE => self::get_error_message ( $error_code, $field ) 
		);
		
		return $bind_error;
	}
	
	// method to get pagesize
	public static function getPageLimit($parameter_array, $maxlimit) {
		if (! array_key_exists ( CommonConstant::QUERY_PARAM_LIMIT, $parameter_array ) || $parameter_array [CommonConstant::QUERY_PARAM_LIMIT] > $maxlimit) {
			return $maxlimit;
		}
		return $parameter_array [CommonConstant::QUERY_PARAM_LIMIT];
	}
	
	public static function build_sql_query($query, $data = []) {
		foreach ( $data as $value ) {
			$from = '/' . preg_quote ( '?', '/' ) . '/';
			$query = preg_replace ( $from, "'" . $value . "'", $query, 1 );
		}
		return $query;
	}
	
	public static function generate_otp($length = 4){
		$chars = "0123456789";
		
		$len = strlen($chars);
		$id = '';
		for ($i=0;$i<$length;$i++){
			$id .= substr($chars, rand(0, $len-1), 1);
		}
		
		return str_shuffle($id);
	}
	
	public static function isEnvProduction(){
		return (self::isStringEqual(ENVIROMENT_TYPE, "PRODUCTION"));
	}
	
	public static function generate_user_identifier($length = 15){
		$chars = "abcdefghijklmnopqrstuvwxyz0123456789";
		
		$len = strlen($chars);
		$id = '';
		for ($i=0;$i<$length;$i++){
			$id .= substr($chars, rand(0, $len-1), 1);
		}
		
		return str_shuffle($id);
	}
	
	public static function valid_mobile_number($mobile_number){
		if(preg_match ( '/^[0-9]{4,13}+$/', $mobile_number)){
			return true;
		}
		return false;
	}
	
	public static function merge_array($array1, $array2){
		if(!is_array($array1)){
			$array1 = array();
		}
		if(!is_array($array2)){
			$array2= array();
		}
		return array_merge($array1, $array2);
	}
	
	public static function encrypt($encrypt, $mc_key) {
		$iv = mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_ECB), MCRYPT_RAND);
		$passcrypt = trim(mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $mc_key, trim($encrypt), MCRYPT_MODE_ECB, $iv));
		$encode = base64_encode($passcrypt);
		return $encode;
	}
	
	public static function decrypt($decrypt, $mc_key) {
		$decoded = base64_decode($decrypt);
		$iv = mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_ECB), MCRYPT_RAND);
		$decrypted = trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $mc_key, trim($decoded), MCRYPT_MODE_ECB, $iv));
		return $decrypted;
	}
	
	public static function generateShortUrlIdentifier($length=7){
		$alpha = "abcdefghijklmnopqrstuvwxyz";
		$alpha_upper = strtoupper($alpha);
		$numeric = "0123456789";
		$chars = $alpha . $alpha_upper . $numeric;
		
		$len = strlen($chars);
		$identifier = '';
		
		for ($i=0;$i<$length;$i++){
			$identifier .= substr($chars, rand(0, $len-1), 1);
		}
		
		return str_shuffle($identifier);
	}
	
	public static function append_media_count($media_count, &$response) {
		$response [CommonConstant::API_CUSTOM_PARAM_IMAGE_COUNT] = 0;
		$response [CommonConstant::API_CUSTOM_PARAM_VIDEO_COUNT] = 0;
		if(count($media_count) > 0) {
			if(self::isStringEqual($media_count[0]["media_file_type"], "image")){
				$response [CommonConstant::API_CUSTOM_PARAM_IMAGE_COUNT] = $media_count[0]["count"];
			}
			elseif(self::isStringEqual($media_count[0]["media_file_type"], "video")){
				$response [CommonConstant::API_CUSTOM_PARAM_VIDEO_COUNT] = $media_count[0]["count"];
			}
			
			if(isset($media_count[1])){
				$response [CommonConstant::API_CUSTOM_PARAM_VIDEO_COUNT] = $media_count[1]["count"];
			}
		}
	}
	
}