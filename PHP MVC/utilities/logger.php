<?php

namespace utilities;

class Logger {
	private static $error_level = array (
			"FATAL",
			"ERROR",
			"WARN",
			"INFO",
			"DEBUG",
			"TRACE" 
	);
	const FATAL = "FATAL";
	const ERROR = "ERROR";
	const WARN = "WARN";
	const INFO = "INFO";
	const DEBUG = "DEBUG";
	const TRACE = "TRACE";
	const ALL = "ALL";
	const NONE = "NONE";
	public static function error($message, $throwable = null) {
		if (self::isErrorEnabled ()) {
			self::log ( self::ERROR, $message, $throwable );
		}
	}
	public static function fatal($message, $throwable = null) {
		if (self::isFatalEnabled ()) {
			self::log ( self::FATAL, $message, $throwable );
		}
	}
	public static function trace($message, $throwable = null) {
		if (self::isTraceEnabled ()) {
			self::log ( self::TRACE, $message, $throwable );
		}
	}
	public static function debug($message, $throwable = null) {
		if (self::isDebugEnabled ()) {
			self::log ( self::DEBUG, $message, $throwable );
		}
	}
	public static function info($message, $throwable = null) {
		if (self::isInfoEnabled ()) {
			self::log ( self::INFO, $message, $throwable );
		}
	}
	public static function warn($message, $throwable = null) {
		if (self::isWarnEnabled ()) {
			self::log ( self::WARN, $message, $throwable );
		}
	}
	public static function isFatalEnabled() {
		return self::_checkLevel ( self::FATAL );
	}
	public static function isDebugEnabled() {
		return self::_checkLevel ( self::DEBUG );
	}
	public static function isInfoEnabled() {
		return self::_checkLevel ( self::INFO );
	}
	public static function isWarnEnabled() {
		return self::_checkLevel ( self::WARN );
	}
	public static function isErrorEnabled() {
		return self::_checkLevel ( self::ERROR );
	}
	public static function isTraceEnabled() {
		return self::_checkLevel ( self::TRACE );
	}
	private static function _checkLevel($level) {
		if (LOGGER_LOG_LEVEL == self::ALL) {
			return true;
		} else if (($index = array_search ( $level, self::$error_level )) >= 0) {
			if (array_search ( LOGGER_LOG_LEVEL, self::$error_level ) >= $index) {
				return true;
			}
		}
		
		return false;
	}
	private static function log($tag, $message, $throwable = null) {
		if (isset ( $message )) {
			if (is_array ( $message )) {
				$message = var_export ( $message, true );
			}
			if (! empty ( $throwable )) {
				$message .= "\n" . $throwable;
			}
			$log_data = $tag . " " . $message;
			error_log ( $log_data );
		}
	}
}