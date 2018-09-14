<?php

use utilities\UtilityMethods;
use utilities\constant\CommonConstant;
use utilities\constant\MediaConstant;

require 'aws.phar';

class S3Storage
{
  
	protected $_S3Client;
	
	protected $_S3Bucket;
	
	private $_S3Config = [
			"region"	=>	AWS_S3_REGION,
			"version"	=>	AWS_S3_VERSION,
			"credentials_key" => AWS_S3_CREDENTIALS_KEY,
			"credentials_secret" => AWS_S3_CREDENTIALS_SECRET,
			"bucket"	=>	AWS_S3_BUCKET
			
	];
	
	public function __construct(){
		$this->_S3Bucket = $this->_S3Config['bucket'];
		
		$this->_S3Client = new Aws\S3\S3Client([
				'version'     =>  $this->_S3Config['version'],
				'region'      =>  $this->_S3Config['region'],
				'credentials' => [
						'key'    => $this->_S3Config['credentials_key'],
						'secret' => $this->_S3Config['credentials_secret']
				]
		]);
	}
	
	public function createPresignedURLForUpload($media_identifier, $parameter){
		
		$acl = "private";
		if(UtilityMethods::isEqual($parameter["media_type"], CommonConstant::UPLOAD_TYPE_PROFILE_IMAGE, true)){
			$key = "profileimage/";
			$acl = "public-read";
		}
		else if(UtilityMethods::isEqual($parameter["media_type"], CommonConstant::UPLOAD_TYPE_THUMBNAIL, true)){
			$key = "media/thumbnail/";
		}
		else if(UtilityMethods::isEqual($parameter["media_type"], CommonConstant::UPLOAD_TYPE_AUDIO, true)){
			$key = "audio/";
		}
		else if(UtilityMethods::isEqual($parameter["media_type"], CommonConstant::UPLOAD_TYPE_PROFILE_IMAGE_THUMBNAIL, true)){
			$key = "profileimage/thumbnail/";
			$acl = "public-read";
		}
		else{
			$key = "media/";
		}
		$key .= "$media_identifier" . "." . $parameter["file_extension"];
		
		if($this->fileExist($key)){
			return array("ERROR" => "KEY_EXIST");
		}
		
		// Set some defaults for form input fields
		$formInputs = ['acl' => $acl];
		
		// Construct an array of conditions for policy
		$options = [
				['acl' => $acl],
				['bucket' => $this->_S3Bucket],
				['starts-with', '$key', $key],
				['starts-with', '$Content-Type', $parameter["content_type"]],
		];
		
		// Optional: configure expiration time string
		$expires = "+" . AWS_S3_PRESIGNED_URL_UPLOAD_EXPIRY . " minutes";
		
		$postObject = new \Aws\S3\PostObjectV4(
			$this->_S3Client,
			$this->_S3Bucket,
			$formInputs,
			$options,
			$expires
		);
		
		// Get attributes to set on an HTML form, e.g., action, method, enctype
		$formAttributes = $postObject->getFormAttributes();
		
		// Get form input fields. This will include anything set as a form input in
		// the constructor, the provided JSON policy, your AWS Access Key ID, and an
		// auth signature.
		$formInputs = $postObject->getFormInputs();
		$formInputs["content-type"] = $parameter["content_type"];
		$formInputs["key"] = $key;
		
		return array("form_attributes" => $formAttributes, "form_inputs" => $formInputs);
	}
	
	public function createPresignedURLForGet($file_extension, $media_type, $media_identifier){
		
		if(UtilityMethods::isEqual($media_type, CommonConstant::UPLOAD_TYPE_THUMBNAIL, true)){
			$key = "media/thumbnail/";
		}
		else if(UtilityMethods::isEqual($media_type, CommonConstant::UPLOAD_TYPE_AUDIO, true)){
			$key = "audio/";
		}
		else{
			$key = "media/";
		}
		$key .= $media_identifier . "." . $file_extension;
		
		$cmd = $this->_S3Client->getCommand('GetObject', [
				'Bucket' => $this->_S3Bucket,
				'Key'    => $key
		]);
		
		$request = $this->_S3Client->createPresignedRequest($cmd, "+" . AWS_S3_PRESIGNED_URL_GET_OBJECT_EXPIRY . " minutes");
		
		// Get the actual presigned-url
		return (string) $request->getUri();
	}
	
	public function createPublicURLForGet($file_extension, $media_identifier, $fetch_actual_image=false){
		$key = "profileimage/thumbnail/" . $media_identifier . "." . $file_extension;
		if($fetch_actual_image){
			$key = "profileimage/" . $media_identifier . "." . $file_extension;
		}
		$url = $this->_S3Client->getObjectUrl($this->_S3Bucket, $key);
		return $url;
	}
	
	public function remove($file_extension, $media_identifier, $media_type){
		try {
			
			if(UtilityMethods::isEqual($media_type, MediaConstant::MEDIA_TYPE_PROFILE_IMAGE, true)){
				$key = "profileimage/";
				$thumbnail_key = "profileimage/thumbnail/";
			}
			elseif(UtilityMethods::isEqual($media_type, MediaConstant::MEDIA_TYPE_AUDIO, true)){
				$key = "audio/";
				$thumbnail_key = null;
			}
			else{
				$key = "media/";
				$thumbnail_key = "media/thumbnail/";
			}
			
			if (UtilityMethods::isNotEmpty($thumbnail_key)){
				$thumbnail_result = $this->_S3Client->deleteObject([
						'Bucket' => $this->_S3Bucket,
						'Key'    => $thumbnail_key . $media_identifier . "." . $file_extension,
				]);
			}
			
			$result = $this->_S3Client->deleteObject([
					'Bucket' => $this->_S3Bucket,
					'Key'    => $key . $media_identifier . "." . $file_extension,
			]);
			
			return [];
		}catch (Exception $e){
			throw $e;
		}
	}
	
	public function fileExist($key){
		try {
			$result = $this->_S3Client->doesObjectExist($this->_S3Bucket, $key);
			if($result === false){
				return false;
			}
			return true;
		}catch (Exception $e){
			throw $e;
		}
	}
}
