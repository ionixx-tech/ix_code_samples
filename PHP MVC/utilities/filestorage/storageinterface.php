<?php

interface StorageInterface{
	
	const  ERROR_FILE_ALREADY_EXIST = 1000;
	const  ERROR_FILE_NOT_EXIST = 1001;
	const  ERROR_FILE_COULD_NOT_BE_CREATED = 1002;
	const  UNKNOWN_ERROR = 1008;
	
	const ErrorMessage = [
			self::ERROR_FILE_ALREADY_EXIST => "File already exist.",
			self::ERROR_FILE_NOT_EXIST => "File not exist.",
			self::ERROR_FILE_COULD_NOT_BE_CREATED => "Unable to create file.",
			self::UNKNOWN_ERROR => "Unknown error occured.",
			
	];
	
	public function create($key,$file);
	
	public function fileExist($key);
	
	public function get($key);
	
	public function remove($key);
}