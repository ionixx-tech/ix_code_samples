<?php
use utilities\Logger;

define ( 'DS', DIRECTORY_SEPARATOR );
define ( 'BASE_PATH', dirname ( __FILE__ ) );
define ( 'CONTEXT_PATH', dirname ( __FILE__ ) . DS );
define ( 'CONFIG_PATH', CONTEXT_PATH . 'config' . DS );
define ( 'ERROR_MSG_PATH', CONTEXT_PATH . DS . 'utilities' . DS . 'error' . DS );

spl_autoload_register ( "autoload", true, true );

date_default_timezone_set ( 'UTC' );

$error_log = "/var/log/apache2/xehar_" . date ( "Y-m-d" ) . ".log";
error_reporting ( E_ALL | E_STRICT );
ini_set ( 'display_errors', 1 );
ini_set ( "log_errors", "1" );
ini_set ( "error_log", $error_log );
const LOGGER_LOG_LEVEL = Logger::DEBUG;
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
header('Access-Control-Allow-Credentials: true');

require_once CONFIG_PATH . 'config.php';
function autoload($class) {
	try {
		$classPath = CONTEXT_PATH . strtolower ( str_replace ( '\\', '/', $class ) . '.php' );
		if (file_exists ( $classPath )) {
			require_once $classPath;
		} else {
			/* if (substr_compare ( strtolower ( $class ), "callback", - 8, 8 ) != 0) {
				throw new Exception ( 'File not found : ' . $classPath );
			} */
		}
	} catch ( Exception $e ) {
		error_log ( $e );
		die ( "File not found." . $e );
	}
}
