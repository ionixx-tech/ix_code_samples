<?php

namespace utilities;

class Cacheutility {
	
	// method to get $key as parameters
	public static function get($key) {
		$file = "/tmp/$key";
		if (file_exists ( $file )) {
			$timedif = (time () - filemtime ( $file ));
			if ($timedif < 30) {
				@include $file;
				return isset ( $val ) ? $val : false;
			}
		}
		return false;
	}
	public static function set($key, $val) {
		$val = var_export ( $val, true );
		// HHVM fails at __set_state, so just use object cast for now
		$val = str_replace ( 'stdClass::__set_state', '(object)', $val );
		file_put_contents ( "/tmp/$key", '<?php $val = ' . $val . ';' );
	}
	public static function erase($key) {
		$file = "/tmp/$key";
		unlink ( $file );
	}
}