<?php

namespace utilities;

class CommonHelper {
	
	// method to erase with $key as parameters
	public static function build_header_param($original_headers) {
		$headers = array ();
		foreach ( $original_headers as $header_key => $header_value ) {
			switch ($header_key) {
				case 'X-Username' :
					$headers ['user_identifier'] = $header_value;
					break;
				
				case 'X-Auth-Token' :
					$headers ['auth_token'] = $header_value;
					break;
				
				default :
					break;
			}
		}
		return $headers;
	}
	
	public static function build_api_parameter($input) {
		if (empty ( $input [0] )) {
			return null;
		} else if (isset ( $input [1] )) {
			return $input;
		} else {
			return $input [0];
		}
	}
}