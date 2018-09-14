<?php
use utilities\UtilityMethods;
use utilities\DbConnector;
use utilities\CommonHelper;
use utilities\constant\ResponseConstant;
use utilities\Logger;
use utilities\constant\ApiResponseConstant;
use dao\UserDao;
use utilities\Headerinfo;
use controller\api\Controller;

$base_path = BASE_PATH;
$last_ds = strrpos ( $base_path, DS ) + 1;
$context_name = substr ( $base_path, $last_ds );
$url_parts = explode ( "/", $_SERVER ['REQUEST_URI'] );
$get_context_name_pos = array_search ( $context_name, $url_parts );

if (! empty ( $get_context_name_pos )) {
	$url_parts = array_splice ( $url_parts, $get_context_name_pos + 1 );
}

$query_string_pos = strpos ( $url_parts [count ( $url_parts ) - 1], '?' );
if ($query_string_pos !== false) {
	$action_explode = explode ( "?", $url_parts [count ( $url_parts ) - 1] );
	$url_parts [count ( $url_parts ) - 1] = $action_explode [0];
}
$url_parts = array_filter ( $url_parts );

$request_method = strtolower ( $_SERVER ['REQUEST_METHOD'] );

//Handling User authentication with username and password
if ($url_parts[0] == 'user' && empty($url_parts[1]) && $request_method == 'post') {
	$user_controller = UtilityMethods::get_controller('User');
	Logger::debug($request_method .' '. $_SERVER['REQUEST_URI']);
	$user_controller->log_inputs();
	$user_controller->authenticate();
	exit;
}

$controller_name = $url_parts [0];

// $load = UtilityMethods::get_controller ( $controller_name);

$headers = CommonHelper::build_header_param ( apache_request_headers () );
if (! isset ( $headers ['username'] ) || ! isset ( $headers ['auth_token'] )) {
	$load->dispatch_failure ( ApiResponseConstant::HTTP_HEADER_INFO_MISSING );
}

$connection = DbConnector::getConnection ();
$user_details = UserDao::authenticate_authtoken ( $connection, $headers );
DbConnector::closeConnection();

if (empty ( $user_details )) {
	$load->dispatch_failure ( ApiResponseConstant::UNAUTHORIZED_ACCESS );
}


Headerinfo::set($headers);
Headerinfo::setValue("user_id", $user_details["user_id"]);
Headerinfo::setValue("user_name", $user_details["user_name"]);

$load->_screen_name = $url_parts [0];
array_shift ( $url_parts );
$action_identifier = CommonHelper::build_api_parameter ( $url_parts );
if (method_exists ( $load, $request_method )) {
	$load->log_inputs ();
	$load->{$request_method} ( $action_identifier );
} else {
	$rest = new Controller();
	$rest->response ( '', ResponseConstant::HTTP_NOT_IMPLEMENTED );
}
