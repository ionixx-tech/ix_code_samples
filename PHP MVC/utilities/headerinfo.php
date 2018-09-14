<?php

namespace utilities;

class Headerinfo {
	/**
	 *
	 * @var declared as protected
	 */
	protected static $_headerInfo = [ ];
	
	public static function get() {
		return self::$_headerInfo;
	}
	
	public static function set($value) {
		self::$_headerInfo = $value;
	}
	
	public static function getValue($key, $default = null) {
		if (isset ( self::$_headerInfo [$key] )) {
			return self::$_headerInfo [$key];
		} else {
			return $default;
		}
	}
	
	public static function setValue($key, $value) {
		self::$_headerInfo [$key] = $value;
	}
}