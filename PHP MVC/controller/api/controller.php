<?php

namespace controller\api;

use utilities\constant\ApiResponseConstant;
use utilities\constant\CommonConstant;
use utilities\constant\ResponseConstant;
use utilities\Logger;
use utilities\UtilityMethods;

class Controller {
	protected $_request;
	protected $_facade;
	protected $_code;
	public $_content_type = "application/json";
	public $_screen_name = "";
	protected $_is_request_encrypted = false;
	
	function __construct($class = null) {
		if ($this->get_request_method() == 'OPTIONS') {
			$this->dispatch_success();
		}
		$this->inputs ();
		$facade = '\facade\\' . $class . "Facade";
		$this->_facade = new $facade ( $class );
	}
	
	private function inputs() {
		$method = $this->get_request_method ();
		$content_type = $this->get_request_content_type ();
		
		if(ENCRYPT_DECRYPT_POST_DATA_MANDATORY || preg_match ( "/text\/plain/i", $content_type )){
			$content_type = "application/json";
			$this->_is_request_encrypted = true;
		}
		if (preg_match ( "/application\/json/i", $content_type )) {
			if (UtilityMethods::isEqual ( $method, "GET", true )) {
				$this->_request = $this->cleanInputs ( $_GET );
			} else {
				if (! array_key_exists ( "_{$method}_DATA_FILLED", $GLOBALS )) {
					$input_content = file_get_contents ( "php://input" );
					if($this->_is_request_encrypted){
						Logger::debug("ACTUAL ENCRYPTED REQUEST: " . $input_content);
						$input_content = UtilityMethods::decrypt($input_content, SECRET_KEY_FOR_ENCRYPT_DECRYPT);
					}
					$input_array = json_decode ( $input_content, true );
					$GLOBALS ["RAW_INPUT_CONTENT"] = $input_content;
					$GLOBALS ["_{$method}"] = $input_array;
					$GLOBALS ["_{$method}_DATA_FILLED"] = "YES";
					// Add these request vars into _REQUEST, mimicing default behavior, PUT/DELETE will override existing COOKIE/GET vars
					if (! is_array ( $this->_request )) {
						$this->_request = array ();
					}
					$_REQUEST = $this->_request + $_REQUEST;
				}
				$this->_request = $GLOBALS ["_{$method}"];
				if (! is_array ( $this->_request )) {
					$this->_request = array ();
				}
			}
		} else {
			switch ($method) {
				case "POST" :
					$this->_request = $this->cleanInputs ( $_POST );
					break;
				case "GET" :
					$this->_request = $this->cleanInputs ( $_GET );
					break;
				case "PUT" :
				case "DELETE" :
					if (! array_key_exists ( "_{$method}", $GLOBALS )) {
						$input_content = file_get_contents ( "php://input" );
						parse_str ( $input_content, $this->_request );
						$GLOBALS ["_{$method}"] = $this->_request;
						// Add these request vars into _REQUEST, mimicing default behavior, PUT/DELETE will override existing COOKIE/GET vars
						$_REQUEST = $this->_request + $_REQUEST;
					}
					$this->_request = $this->cleanInputs ( $GLOBALS ["_{$method}"] );
					break;
				default :
					$this->response ( '', ResponseConstant::HTTP_FORBIDDEN );
					break;
			}
		}
	}
	
	private function cleanInputs($data) {
		$clean_input = array ();
		if (is_array ( $data )) {
			foreach ( $data as $k => $v ) {
				$clean_input [$k] = $this->cleanInputs ( $v );
			}
		} else {
			if (get_magic_quotes_gpc ()) {
				$data = trim ( stripslashes ( $data ) );
			}
			$data = strip_tags ( $data );
			$clean_input = trim ( $data );
		}
		return $clean_input;
	}
	
	// method to check if REQUEST METHOD
	public function get_request_method() {
		return $_SERVER ['REQUEST_METHOD'];
	}
	
	public function get_request_content_type() {
		$content_type = "";
		$headers = apache_request_headers ();
		foreach ( $headers as $key => $value ) {
			if (UtilityMethods::isStringEqual ( "$key", "Content-Type", true )) {
				$content_type = $value;
			}
		}
		// UtilityMethods::printDebugMessage("Content Type:".$content_type);
		return $content_type;
	}
	
	// method to set the status Message
	public function get_status_message() {
		$status = array (
				100 => 'Continue',
				101 => 'Switching Protocols',
				200 => 'OK',
				201 => 'Created',
				202 => 'Accepted',
				203 => 'Non-Authoritative Information',
				204 => 'No Content',
				205 => 'Reset Content',
				206 => 'Partial Content',
				300 => 'Multiple Choices',
				301 => 'Moved Permanently',
				302 => 'Found',
				303 => 'See Other',
				304 => 'Not Modified',
				305 => 'Use Proxy',
				306 => '(Unused)',
				307 => 'Temporary Redirect',
				400 => 'Bad Request',
				401 => 'Unauthorized',
				402 => 'Payment Required',
				403 => 'Forbidden',
				404 => 'Not Found',
				405 => 'Method Not Allowed',
				406 => 'Not Acceptable',
				407 => 'Proxy Authentication Required',
				408 => 'Request Timeout',
				409 => 'Conflict',
				410 => 'Gone',
				411 => 'Length Required',
				412 => 'Precondition Failed',
				413 => 'Request Entity Too Large',
				414 => 'Request-URI Too Long',
				415 => 'Unsupported Media Type',
				416 => 'Requested Range Not Satisfiable',
				417 => 'Expectation Failed',
				500 => 'Internal Server Error',
				501 => 'Not Implemented',
				502 => 'Bad Gateway',
				503 => 'Service Unavailable',
				504 => 'Gateway Timeout',
				505 => 'HTTP Version Not Supported' 
		);
		return ($status [$this->_code]) ? $status [$this->_code] : $status [ResponseConstant::HTTP_INTERNAL_SERVER_ERROR];
	}
	
	// method to append the header and return the response
	public function response($data, $status, $header = null) {
		$this->_code = ($status) ? $status : ResponseConstant::HTTP_OK;
		header ( "HTTP/1.1 " . $this->_code . " " . $this->get_status_message () );
		if (is_array ( $data ) || is_object ( $data )) {
			header ( "Content-Type:" . $this->_content_type );
			$data = $this->wrapResponseAsJSON ( $data );
		}
		
		if (is_array ( $header )) {
			foreach ( $header as $fields => $value ) {
				header ( $fields . ":" . $value );
			}
		}
		if($this->_is_request_encrypted){
			$data = UtilityMethods::encrypt($data, SECRET_KEY_FOR_ENCRYPT_DECRYPT);
		}
		echo $data;
		exit ();
	}
	
	// method to convert response --> json format --> Base64 encode
	public function wrapResponse($data) {
		if (is_array ( $data ) || is_object ( $data )) {
			header ( "Content-Type:" . $this->_content_type );
			return $this->wrapResponseAsJSON ( $data );
		}
	}
	
	// method to convert Response to JSON
	public function wrapResponseAsJSON($data) {
		$response = json_encode ( $data );
		if (json_last_error ()) {
			Logger::debug ("JSON encode failed : " . json_last_error_msg () . " data : " . var_export ( $data, true ) );
			$this->dispatch_failure ( ApiResponseConstant::INVALID_JSON_REQUEST );
		}
		return $response;
	}
	
	// Method to extract common headers from the response
	public function set_common_headers(&$response_array, &$header_content) {
		$page_info = array ();
		$media_count = array();
		if (is_array ( $response_array )) {
			if (isset ( $response_array [CommonConstant::API_CUSTOM_PARAM_RESOURCE_COUNT] )) {
				$header_content ['X-Resource-Count'] = $response_array [CommonConstant::API_CUSTOM_PARAM_RESOURCE_COUNT];
			}
			
			if (isset ( $response_array [CommonConstant::API_CUSTOM_PARAM_MAX_PAGE_SIZE] )) {
				$page_info [] = 'max-page-size=' . $response_array [CommonConstant::API_CUSTOM_PARAM_MAX_PAGE_SIZE];
			}
			if (isset ( $response_array [CommonConstant::API_CUSTOM_PARAM_CURRENT_OFFSET] )) {
				$page_info [] = 'current-offset=' . $response_array [CommonConstant::API_CUSTOM_PARAM_CURRENT_OFFSET];
			}
			if (count ( $page_info ) > 0) {
				$header_content ['X-Page-Info'] = implode ( ',', $page_info );
			}
			
			if (isset ( $response_array [CommonConstant::API_CUSTOM_PARAM_IMAGE_COUNT] )) {
				$media_count[] = 'image=' . $response_array [CommonConstant::API_CUSTOM_PARAM_IMAGE_COUNT];
			}
			if (isset ( $response_array [CommonConstant::API_CUSTOM_PARAM_VIDEO_COUNT] )) {
				$media_count[] = 'video=' . $response_array [CommonConstant::API_CUSTOM_PARAM_VIDEO_COUNT];
			}
			if (count ( $media_count) > 0) {
				$header_content ['X-Media-Count'] = implode ( ',', $media_count);
			}
			
			if (isset ( $response_array [CommonConstant::API_CUSTOM_PARAM_RESOURCE_LIST] )) {
				if (UtilityMethods::isEmpty ( $response_array [CommonConstant::API_CUSTOM_PARAM_RESOURCE_LIST] )) {
					$response_array [CommonConstant::API_CUSTOM_PARAM_RESOURCE_LIST] = array ();
				}
				$response_array = $response_array [CommonConstant::API_CUSTOM_PARAM_RESOURCE_LIST];
			}
		}
	}
	
	// Method to dispatch success message
	public function dispatch_success($response_array = NULL) {
		$header_content = null;
		if (is_array ( $response_array ) && ! empty ( $response_array )) {
			$this->set_common_headers ( $response_array, $header_content );
		} else {
			$response_array = new \stdClass ();
		}
		
		$this->response ( $response_array, ResponseConstant::HTTP_OK, $header_content );
	}
	
	// Method to dispatch failure message
	public function dispatch_failure($error_code, $error_details = null) {
		
		if(!empty($error_code) && !is_array($error_code) && $error_code < 600 && $error_code > 0) {
			$this->response("", $error_code);
		} 
		
		if (is_array ( $error_code )) {
			$replace = (empty ( $error_code [CommonConstant::ERROR_MESSAGE] )) ? $this->_screen_name : $error_code [CommonConstant::ERROR_MESSAGE];
			$error_message = UtilityMethods::get_error_message ( $error_code [CommonConstant::ERROR_CODE], $replace );
			$response_array = array (
					CommonConstant::RESPONSE_ERROR_CODE => $error_code [CommonConstant::ERROR_CODE],
					CommonConstant::RESPONSE_ERROR_MESSAGE => $error_message 
			);
		} else {
			if (is_array ( $error_details )) {
				$error_message = UtilityMethods::get_error_message ( $error_code );
				$response_array = array (
						CommonConstant::RESPONSE_ERROR_CODE => $error_code,
						CommonConstant::RESPONSE_ERROR_MESSAGE => $error_message,
						'errors' => $error_details 
				);
			} else {
				$replace = (empty ( $error_details )) ? $this->_screen_name : $error_details;
				$error_message = UtilityMethods::get_error_message ( $error_code, $replace );
				$response_array = array (
						CommonConstant::RESPONSE_ERROR_CODE => $error_code,
						CommonConstant::RESPONSE_ERROR_MESSAGE => $error_message 
				);
			}
		}
		$http_status_code = $this->http_error_code_map ( $response_array [CommonConstant::RESPONSE_ERROR_CODE] );
		$this->response ( $this->wrapResponse ( $response_array ), $http_status_code );
	}
	
	// Method to dispatch warning message
	public function dispatch_warning($response_array, $warning_code, $warning_message) {
		$response_additional_array = array (
				CommonConstant::RESPONSE_ERROR_CODE => $warning_code,
				CommonConstant::RESPONSE_ERROR_MESSAGE => $warning_message 
		);
		$response_array = array_merge ( $response_additional_array, $response_array );
		$this->response ( $this->wrapResponse ( $response_array ), ResponseConstant::HTTP_OK );
	}
	
	// Method to dispatch custom failure message
	public function dispatch_custom_failure($error_message) {
		$response_array = array (
				CommonConstant::RESPONSE_ERROR_MESSAGE => $error_message 
		);
		$this->response ( $this->wrapResponse ( $response_array ), ResponseConstant::HTTP_OK );
	}
	
	/*
	 * Method to Map the Operation Error Code With Header Error Code @return An Array which contain error code for the particular response
	 */
	public function http_error_code_map($error_code) {
		include_once ERROR_MSG_PATH . 'error_messages.php';
		$error_mapped = $GLOBALS ['error_code_mapping'];
		
		if (array_key_exists ( $error_code, $error_mapped )) {
			return ($error_mapped [$error_code]) ? $error_mapped [$error_code] : ResponseConstant::HTTP_INTERNAL_SERVER_ERROR;
		} else {
			Logger::warn ( "Error code: " . $error_code . " not found in HTTP error code mapping" );
			return ResponseConstant::HTTP_INTERNAL_SERVER_ERROR;
		}
	}
	
	/*
	 * Method to Bind Error Response @return An Array which contain error code, fields, optional fields and value for the particular response
	 */
	public function bind_error_validation($error_code, $field = null, $detail_error = null) {
		$replace = (empty ( $field )) ? $this->_screen_name : $field;
		$bind_error = array (
				CommonConstant::RESPONSE_ERROR_CODE => $error_code,
				CommonConstant::RESPONSE_ERROR_DESCRIPTION => UtilityMethods::get_error_message ( $error_code, $replace ) 
		);
		if (isset ( $replace ) && ! empty ( $replace )) {
			$bind_error [CommonConstant::RESPONSE_ERROR_FIELD] = $field;
		}
		
		if (isset ( $detail_error ) && is_array ( $detail_error )) {
			$bind_error = array_merge ( $bind_error, $detail_error );
		}
		
		return $bind_error;
	}
	
	/*
	 * Method to Bind Error Response @return An Array which contain error code, fields, optional fields and value for the particular response
	 */
	public function bind_error($error_code, $field = null) {
		$bind_error = array (
				CommonConstant::ERROR_CODE => $error_code,
				CommonConstant::ERROR_MESSAGE => UtilityMethods::get_error_message ( $error_code, $field ) 
		);
		return $bind_error;
	}
	
	/*
	 * Method to check validator response @return An Array which contain multiple error code with details
	 */
	public function check_validator_response($validation) {
		if (isset ( $validation ["validation_errors"] ) && count ( $validation ["validation_errors"] ) > 0) {
			$response_array = array ();
			
			foreach ( $validation ["validation_errors"] as $fields => $code ) {
				$bind_error_response [] = $this->bind_error_validation ( $code, $fields );
			}
			$this->dispatch_failure ( ApiResponseConstant::VALIDATION_FAILED, $bind_error_response );
		}
	}
	
	public function check_error_response($response) {
		if (is_array ( $response ) && isset ( $response [CommonConstant::ERROR_CODE] )) {
			$response [CommonConstant::ERROR_MESSAGE] = (isset ( $response [CommonConstant::ERROR_MESSAGE] )) ? $response [CommonConstant::ERROR_MESSAGE] : NULL;
			$this->dispatch_failure ( $response );
		}
		
		if (isset ( $response ["validation_errors"] ) && count ( $response ["validation_errors"] ) > 0) {
			$bind_error_response = array ();
			
			foreach ( $response ["validation_errors"] as $fields => $code ) {
				$bind_error_response [] = $this->bind_error_validation ( $code, $fields );
			}
			$this->dispatch_failure ( ApiResponseConstant::VALIDATION_FAILED, $bind_error_response );
		}
	}
	
	public function log_inputs() {
		$a = var_export ( $this->_request, true );
		$b = substr ( $a, 0, 1000 );
		Logger::debug ( "Request Input : " . $b );
	}
}