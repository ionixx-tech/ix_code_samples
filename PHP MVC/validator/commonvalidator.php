<?php

namespace validator;

use utilities\constant\ApiResponseConstant;

class Commonvalidator extends gump {
	private $error_codes = array ();
	private $param_map_rules = array ();
	public function set_error_codes(array $error_code_list = array()) {
		$this->error_codes = $error_code_list;
	}
	public function set_param_map_rules(array $param_map_rules = array()) {
		$this->param_map_rules = $param_map_rules;
	}
	public function set_field_map(array $field_map = array()) {
		if (count ( $field_map ) > 0) {
			foreach ( $field_map as $old_field => $new_field ) {
				self::set_field_name ( $old_field, $new_field );
			}
		}
	}
	public function clear_field_map() {
		self::$fields = array ();
	}
	
	/**
	 * Getter/Setter for the validation rules
	 *
	 * @param array $rules        	
	 * @param string $action_type
	 *        	(can contain one for the following: add and edit)
	 * @return array
	 */
	public function set_validation_rules(array $rules = array(), $action_type) {
		if (empty ( $rules )) {
			return $this->validation_rules;
		}
		if (isset ( $action_type )) {
			if (count ( $rules ) > 0) {
				$consolidated_rules = array ();
				foreach ( $rules as $field => $rule_list ) {
					if (is_array ( $rule_list )) {
						$rules_array = array ();
						if (isset ( $rule_list [$action_type] )) {
							array_push ( $rules_array, $rule_list [$action_type] );
						}
						if (isset ( $rule_list ['common'] )) {
							array_push ( $rules_array, $rule_list ['common'] );
						}
						if (count ( $rules_array ) > 0) {
							$consolidated_rules [$field] = implode ( '|', $rules_array );
						}
					} else {
						$consolidated_rules [$field] = $rules [$field];
					}
				}
				$rules = $consolidated_rules;
			}
		}
		$this->validation_rules = $rules;
	}
	
	/**
	 * Run the filtering and validation after each other.
	 * Overriding parent method to return error details,
	 * rather than boolean false on validation failure,
	 *
	 * @param array $data        	
	 * @param bool $check_fields        	
	 * @return array
	 * @throws Exception
	 */
	public function run(array $data, $return_on_first_error = false) {
		$data = $this->filter ( $data, $this->filter_rules () );
		$validated = $this->do_validate ( $data, $this->validation_rules, $return_on_first_error );
		if ($validated !== true) {
			return array (
					'validation_errors' => $validated 
			);
		}
		$data = $this->do_param_map ( $data, $this->param_map_rules );
		return $data;
	}
	
	/**
	 * Perform data validation against the provided ruleset.
	 * Overriding the parent method to include feature for
	 * returning on first error and return error details as code or message.
	 *
	 * @access public
	 * @param mixed $input        	
	 * @param array $ruleset        	
	 * @param bool $return_on_first_error        	
	 * @return mixed
	 * @throws Exception
	 */
	public function do_validate(array $input, array $ruleset, $return_on_first_error) {
		$this->errors = array ();
		$input_array = $input;
		foreach ( $ruleset as $field => $rules ) {
			$input = $input_array;
			$rules = explode ( '|', $rules );
			if (count ( $fields = explode ( '|', $field ) ) > 1) {
				$field = $fields [1];
				if (isset ( $input_array [$fields [0]] ) && is_array ( $input_array [$fields [0]] )) {
					$input = $input_array [$fields [0]];
				} else {
					$input = array ();
				}
			}
			if (in_array ( "required", $rules ) || (isset ( $input [$field] )) || empty ( $input [$field] ) && array_key_exists ( $field, $input )) {
				foreach ( $rules as $rule ) {
					$method = NULL;
					$param = NULL;
					
					if (strstr ( $rule, ',' ) !== FALSE) { // has params
						$rule = explode ( ',', $rule );
						$method = 'validate_' . $rule [0];
						$param = $rule [1];
						$rule = $rule [0];
					} else {
						$method = 'validate_' . $rule;
					}
					
					if (is_callable ( array (
							$this,
							$method 
					) )) {
						$result = $this->$method ( $field, $input, $param );
						if (is_array ( $result )) { // Validation Failed
							$this->errors [] = $result;
							if ($return_on_first_error === TRUE) {
								break;
							}
						}
					} else if (isset ( self::$validation_methods [$rule] )) {
						if (isset ( $input [$field] )) {
							$result = call_user_func ( self::$validation_methods [$rule], $field, $input, $param );
							$result = $this->$method ( $field, $input, $param );
							if (is_array ( $result )) { // Validation Failed
								$this->errors [] = $result;
								if ($return_on_first_error === TRUE) {
									break;
								}
							}
						}
					} else {
						throw new \Exception ( "Validator method '$method' does not exist." );
					}
				}
			}
			if (count ( $this->errors ) > 0) {
				if ($return_on_first_error === TRUE) {
					break;
				}
			}
		}
		if (count ( $this->errors ) > 0) {
			return $this->get_errors_as_code ();
		} else {
			return TRUE;
		}
	}
	
	// Method to map parameter names to new names
	private function do_param_map($data, array $param_map_rules) {
		if (count ( $param_map_rules ) > 0) {
			foreach ( $param_map_rules as $old_param => $new_param ) {
				if (isset ( $data [$old_param] )) {
					$data [$new_param] = $data [$old_param];
					unset ( $data [$old_param] );
				}
			}
		}
		return $data;
	}
	
	/**
	 * Process the validation errors and return an array of errors as code with field names as keys
	 *
	 * @return array
	 */
	public function get_errors_as_code() {
		if (empty ( $this->errors )) {
			return array ();
		}
		
		$resp = array ();
		
		foreach ( $this->errors as $e ) {
			
			// $field = ucwords(str_replace(array('_','-'), chr(32), $e['field']));
			$field = $e ['field'];
			$param = $e ['param'];
			
			// Let's fetch explicit field names if they exist
			if (array_key_exists ( $e ['field'], self::$fields )) {
				$field = self::$fields [$e ['field']];
			}
			
			$error_set = false;
			if (count ( $this->error_codes ) > 0) {
				$short_validator_name = str_replace ( 'validate_', '', $e ['rule'] );
				if (isset ( $this->error_codes [$short_validator_name] [$field] )) {
					$resp [$field] = $this->error_codes [$short_validator_name] [$field];
					$error_set = true;
				} else if (isset ( $this->error_codes [$short_validator_name] ['*'] )) {
					$resp [$field] = $this->error_codes [$short_validator_name] ['*'];
					$error_set = true;
				}
			}
			
			if (! $error_set) {
				switch ($e ['rule']) {
					case 'validate_required' :
						$resp [$field] = ApiResponseConstant::MISSING_REQUIRED_PARAMETERS;
						break;
					case 'validate_max_len' :
						$resp [$field] = ApiResponseConstant::MAX_LENGTH_EXCEEDED;
						break;
					case 'validate_min_len' :
						$resp [$field] = ApiResponseConstant::MIN_LENGTH_NOT_REACHED;
						break;
					case 'validate_empty' :
						$resp [$field] = ApiResponseConstant::MISSING_REQUIRED_PARAMETERS;
						break;
					case 'validate_unique' :
					case 'validate_array_unique' :
					case 'validate_valid_email' :
					case 'validate_exact_len' :
					case 'validate_alpha' :
					case 'validate_alpha_numeric' :
					case 'validate_alpha_numeric_or_numeric' :
					case 'validate_numeric' :
					case 'validate_integer' :
					case 'validate_boolean' :
					case 'validate_float' :
					case 'validate_valid_url' :
					case 'validate_valid_ip' :
					case 'validate_contains' :
					case 'validate_date' :
					case 'validate_min_numeric' :
					case 'validate_max_numeric' :
					case 'validate_containsList' :
					case 'validate_empty' :
					case 'validate_array' :
					case 'validate_server_address' :
					case 'validate_encoded' :
					case 'validate_enabled_disabled' :
					case 'validate_array_of_array' :
					case 'validate_single_dimension_array' :
					case 'validate_linux_path' :
					case 'validate_fieldList' :
					case 'validate_mobile_number':
					case 'validate_mobile_number_array':
						$resp [$field] = ApiResponseConstant::INVALID_VALUES_IN_PARAMETERS;
						break;
					default :
						throw new \Exception ( 'Error thrown from undefined validation method - ' . $e ['rule'] );
				}
			}
		}
		
		return $resp;
	}
	
	/**
	 * Determine if the provided value is a valid portal user password
	 *
	 * Usage: '<index>' => 'valid_portal_password'
	 *
	 * @access protected
	 * @param string $field        	
	 * @param array $input        	
	 * @param null $param        	
	 * @return mixed
	 */
	public function validate_valid_portal_password($field, $input, $param = NULL) {
		if (! isset ( $input [$field] ) || empty ( $input [$field] )) {
			return;
		}
		$uppercase = preg_match ( '@[A-Z]@', $input [$field] );
		$lowercase = preg_match ( '@[a-z]@', $input [$field] );
		$number = preg_match ( '@[0-9]@', $input [$field] );
		$special = preg_match ( "/.[!,@,#,$,%,^,&,*,?,_,~,-,Â£,(,)]/", $input [$field] );
		
		if (! $uppercase || ! $lowercase || ! ($number || $special)) {
			return array (
					'field' => $field,
					'value' => $input [$field],
					'rule' => __FUNCTION__,
					'param' => $param 
			);
		}
	}
	
	/**
	 * Determine if the provided value is empty
	 *
	 * Usage: '<index>' => 'validate_empty'
	 *
	 * @access protected
	 * @param string $field        	
	 * @param array $input        	
	 * @param null $param        	
	 * @return mixed
	 */
	protected function validate_empty($field, $input, $param = NULL) {
		if (isset ( $input [$field] ) && empty ( $input [$field] ) && ! is_numeric ( $input [$field] )) {
			return array (
					'field' => $field,
					'value' => $input [$field],
					'rule' => __FUNCTION__,
					'param' => $param 
			);
		} else {
			return;
		}
	}
	
	/**
	 * Determine if the provided value is array
	 *
	 * Usage: '<index>' => 'validate_array'
	 *
	 * @access protected
	 * @param string $field        	
	 * @param array $input        	
	 * @param null $param        	
	 * @return mixed
	 */
	protected function validate_array($field, $input, $param = NULL) {
		if (isset ( $input [$field] ) && ! is_array ( $input [$field] )) {
			return array (
					'field' => $field,
					'value' => $input [$field],
					'rule' => __FUNCTION__,
					'param' => $param 
			);
		} else {
			return;
		}
	}
	protected function validate_encoded($field, $input, $param = NULL) {
		if (isset ( $input [$field] ) && ! ValidationMethods::is_encoded_string ( $input [$field] )) {
			return array (
					'field' => $field,
					'value' => $input [$field],
					'rule' => __FUNCTION__,
					'param' => $param 
			);
		} else {
			return;
		}
	}
	
	/**
	 * Determine if the provided value is a valid server address
	 *
	 * Usage: '<index>' => '0.0.0.0 - 255.255.255.255 or valid host name'
	 *
	 * @access protected
	 * @param string $field        	
	 * @param array $input        	
	 * @param null $param        	
	 * @return mixed
	 */
	protected function validate_server_address($field, $input, $param = NULL) {
		if (! isset ( $input [$field] ) || empty ( $input [$field] )) {
			return;
		}
		
		if (! preg_match ( "/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/", $input [$field] ) !== FALSE) {
			return array (
					'field' => $field,
					'value' => $input [$field],
					'rule' => __FUNCTION__,
					'param' => $param 
			);
		}
	}
	
	/**
	 * Determine if the provided value is enabled or disabled
	 *
	 * Usage: '<index>' => 'validate_enabled_disabled'
	 *
	 * @access protected
	 * @param string $field        	
	 * @param array $input        	
	 * @param null $param        	
	 * @return mixed
	 */
	protected function validate_enabled_disabled($field, $input, $param = NULL) {
		if (isset ( $input [$field] ) && (empty ( $input [$field] ) || ($input [$field] != 'enabled' && $input [$field] != 'disabled'))) {
			return array (
					'field' => $field,
					'value' => $input [$field],
					'rule' => __FUNCTION__,
					'param' => $param 
			);
		} else {
			return;
		}
	}
	
	/**
	 * Determine if the provided value is a valid userid for debug - user registration
	 *
	 * Usage: '<index>' => 'alpha_numeric_or_numeric'
	 *
	 * @access protected
	 * @param string $field        	
	 * @param array $input        	
	 * @param null $param        	
	 * @return mixed
	 */
	protected function validate_alpha_numeric_or_numeric($field, $input, $param = NULL) {
		if (! isset ( $input [$field] ) || empty ( $input [$field] )) {
			return;
		}
		
		if (preg_match ( "/^[A-Za-z]+$/i", $input [$field] ) || ! preg_match ( "/^[A-Za-z0-9]+$/i", $input [$field] )) {
			return array (
					'field' => $field,
					'value' => $input [$field],
					'rule' => __FUNCTION__,
					'param' => $param 
			);
		}
	}
	
	/**
	 * Determine if the provided value is a valid Array of Array
	 *
	 * Usage: '<index>' => 'validate_array_of_array'
	 *
	 * @access protected
	 * @param string $field        	
	 * @param array $input        	
	 * @param null $param        	
	 * @return mixed
	 */
	protected function validate_array_of_array($field, $input, $param = NULL) {
		if (! isset ( $input [$field] ) || empty ( $input [$field] ) || ! is_array ( $input [$field] )) {
			return;
		}
		foreach ( $input [$field] as $array ) {
			if (! is_array ( $array )) {
				return array (
						'field' => $field,
						'value' => $input [$field],
						'rule' => __FUNCTION__,
						'param' => $param 
				);
			}
		}
	}
	
	/**
	 * Verify that a value is unique within the pre-defined value set.
	 * OUTPUT: will NOT show the list of values.
	 *
	 * Usage: '<index>' => 'unique,value;value;value'
	 *
	 * @access protected
	 * @param string $field        	
	 * @param array $input        	
	 * @return mixed
	 */
	protected function validate_unique($field, $input, $param = NULL) {
		$param = trim ( strtolower ( $param ) );
		
		if (! isset ( $input [$field] ) || empty ( $input [$field] )) {
			return;
		}
		
		$value = trim ( strtolower ( $input [$field] ) );
		
		$param = explode ( ";", $param );
		if (count ( $param ) == 0) {
			return;
		}
		
		if (! in_array ( $value, array_map ( 'strtolower', $param ) )) { // valid, return nothing
			return;
		} else {
			return array (
					'field' => $field,
					'value' => $value,
					'rule' => __FUNCTION__,
					'param' => $param 
			);
		}
	}
	
	/**
	 * Verify that a value is unique within the pre-defined value set.
	 * OUTPUT: will NOT show the list of values.
	 *
	 * Usage: '<index>' => 'unique,value;value;value'
	 *
	 * @access protected
	 * @param string $field        	
	 * @param array $input        	
	 * @return mixed
	 */
	protected function validate_array_unique($field, $input, $param = NULL) {
		$param = trim ( strtolower ( $param ) );
		
		if (! isset ( $input [$field] ) || ! is_array ( $input [$field] ) || empty ( $input [$field] )) {
			return;
		}
		
		$value = array_map ( 'strtolower', $input [$field] );
		
		$param = explode ( ";", $param );
		if (count ( $param ) == 0) {
			return;
		}
		
		if (count ( array_unique ( $value ) ) == count ( $value )) { // valid, return nothing
			return;
		} else {
			return array (
					'field' => $field,
					'value' => $value,
					'rule' => __FUNCTION__,
					'param' => $param 
			);
		}
	}
	
	/**
	 * Verify that a value is single dimensional array.
	 * OUTPUT: will NOT show the list of values.
	 *
	 * Usage: '<index>' => 'unique,value;value;value'
	 *
	 * @access protected
	 * @param string $field        	
	 * @param array $input        	
	 * @return mixed
	 */
	protected function validate_single_dimension_array($field, $input, $param = NULL) {
		$param = trim ( strtolower ( $param ) );
		
		if (! isset ( $input [$field] ) || empty ( $input [$field] ) || ! is_array ( $input [$field] )) {
			return;
		}
		
		foreach ( $input [$field] as $v ) {
			if (is_array ( $v )) {
				return array (
						'field' => $field,
						'value' => $input [$field],
						'rule' => __FUNCTION__,
						'param' => $param 
				);
			}
		}
		return;
	}
	
	/**
	 * Verify that a value is linux path.
	 * OUTPUT: will NOT show the list of values.
	 *
	 * Usage: '<index>' => 'linux_path'
	 *
	 * @access protected
	 * @param string $field        	
	 * @param array $input        	
	 * @return mixed
	 */
	protected function validate_linux_path($field, $input, $param = NULL) {
		if (! isset ( $input [$field] ) || empty ( $input [$field] )) {
			return;
		}
		
		if (! preg_match ( "~^(/[^/]+)+/{0,1}$~", $input [$field] )) {
			return array (
					'field' => $field,
					'value' => $input [$field],
					'rule' => __FUNCTION__,
					'param' => $param 
			);
		}
		return;
	}
	
	protected function validate_alpha_underscore_space($field, $input, $param = NULL) {
		if (! isset ( $input [$field] ) || empty ( $input [$field] )) {
			return;
		}
		
		if (! preg_match ( "/^([a-z0-9_\s])+$/i", $input [$field] ) !== FALSE) {
			return array (
					'field' => $field,
					'value' => $input [$field],
					'rule' => __FUNCTION__,
					'param' => $param 
			);
		}
	}
	
	/**
	 * method user to vaildate field list
	 *
	 * Usage: '<index>' => 'valid_fieldsList'
	 *
	 * @access protected
	 * @param string $field        	
	 * @param array $input        	
	 * @param null $param        	
	 * @return mixed
	 */
	public function validate_fieldList($field, $input, $param = NULL) {
		$values = trim ( strtolower ( $input [$field] ) );
		$values = explode ( ",", $input [$field] );
		$param = explode ( ";", $param );
		foreach ( $values as $value ) {
			if (! in_array ( $value, $param )) {
				return array (
						'field' => $field,
						'value' => $value,
						'rule' => __FUNCTION__,
						'param' => $param 
				);
			}
		}
	}
	
	public function validate_fieldSearchList($field_search, $input, $param = NULL) {
		
	}
	
	protected function validate_mobile_number($field, $input, $param = NULL) {
		if (! isset ( $input [$field] ) || empty ( $input [$field] )) {
			return;
		}
		
		if (! preg_match ( '/^[0-9]{4,13}+$/' , $input [$field] ) !== FALSE) {
			return array (
					'field' => $field,
					'value' => $input [$field],
					'rule' => __FUNCTION__,
					'param' => $param
			);
		}
	}
	
	protected function validate_mobile_number_array($field, $input, $param = NULL) {
		if (! isset ( $input [$field] ) || empty ( $input [$field] ) || !is_array( $input [$field])) {
			return;
		}
		
		foreach ($input [$field] as $mobile_number){
			if (! preg_match ( '/^[0-9]{4,13}+$/' , $mobile_number) !== FALSE) {
				return array (
						'field' => $field,
						'value' => $mobile_number,
						'rule' => __FUNCTION__,
						'param' => $param
				);
			}
		}
	}
}