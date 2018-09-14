<?php
namespace utilities;

class smsUtility{
	
	// method to send SMS for mobile verification and non-dubuqu user media sharing
	public static function sendSMS($message, $mobile_number){
		$curl = curl_init();
		$api_url = SMS_MSG91_API_URL;
		$post_data = array
		(
				'authkey' => SMS_MSG91_API_KEY,
			    'mobiles' => $mobile_number,
			    'message' => urlencode($message),
			    'sender' => SMS_MSG91_SENDER_ID,
			    'route' => "4",
				'response' => 'json'
		);
		
		Logger::debug("SMS API Path : ".$api_url);
		Logger::debug("SMS API Request : ".var_export($post_data,true));
		
		curl_setopt_array($curl, array(
				CURLOPT_URL => $api_url,
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_POST => true,
				CURLOPT_POSTFIELDS => $post_data,
				CURLOPT_SSL_VERIFYHOST => 0,
				CURLOPT_SSL_VERIFYPEER => 0
		));
	 
		if(!UtilityMethods::isEnvProduction()){
			return true;
		}
		
		$response = curl_exec($curl);
		$err = curl_error($curl);
		curl_close($curl);
		
		Logger::debug("SMS API Response : ".$response);
		
		if(!empty($response)){
			$response = json_decode($response,true);
		}
		if ($err || !isset($response['type']) || $response['type'] !=  "success") {
			Logger::error($response);
			return false;
		} else {
			return $response['message'];
		}
	}
}