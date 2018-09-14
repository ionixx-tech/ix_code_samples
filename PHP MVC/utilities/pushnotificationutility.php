<?php
namespace utilities;

class PushNotificationUtility{
	
	// send push notification to Android phones
	public static function sendAndroidPushNotification($parameter, $recipients){
		
		$content = array(
				"en" => $parameter['data']["message"]
		);
		
		$fields = array(
				'app_id' => PUSH_NOTIFICATION_APP_ID,
				'include_player_ids' => $recipients,
				'data' => $parameter,
				'contents' => $content
		);
		
		$fields = json_encode($fields);
		
		Logger::debug("Push Notification Path : ".PUSH_NOTIFICATION_API_URL);
		Logger::debug("Push Notification Request : ".var_export($fields, true));
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, PUSH_NOTIFICATION_API_URL);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
				'Authorization: Basic ' . PUSH_NOTIFICATION_API_KEY));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		curl_setopt($ch, CURLOPT_POST, TRUE);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		
		$response = curl_exec($ch);
		$err = curl_error($ch);
		curl_close($ch);
		
		Logger::debug("Push Notification Response : ".$response);
		
		if(!empty($response)){
			$response = json_decode($response,true);
		}
		if ($err || isset($response['error'])) {
			Logger::error($response);
		} 
	}
	
	// send push notificatio to IPhone
	public static function sendApnsPushNotification($parameter, $recipients){
		
		if(UtilityMethods::isEnvProduction()){
			$apnsHost = APNS_PRODUCTION_HOST;
			$apnsPort = APNS_PRODUCTION_PORT;
		} else{
			$apnsHost = APNS_SANDBOX_HOST;
			$apnsPort = APNS_SANDBOX_PORT;
		}
		
		// Create the message content that is to be sent to the device.
		$apnsBody ['aps'] = array (
				'alert' => $parameter["title"],
			//	'badge' => $parameter["badge"],
				'sound' => 'default' 
		);
		$apnsBody ['payload'] = $parameter["data"];
		
		// Encode the body to JSON.
		$apnsBody = json_encode ( $apnsBody );
		
		// Create the Socket Stream.
		$apnsContext = stream_context_create ();
		stream_context_set_option ( $apnsContext, 'ssl', 'local_cert', APNS_CERTIFICATE);
		
		// Remove this line if you would like to enter the Private Key Passphrase manually.
		stream_context_set_option ( $apnsContext, 'ssl', 'passphrase', APNS_CERTIFICATE_PASS_PHRASE);
		
		// Open the Connection to the APNS Server.
		$apnsSocket = stream_socket_client ( 'ssl://' . $apnsHost . ':' . $apnsPort, $error, $errstr, 30, STREAM_CLIENT_CONNECT | STREAM_CLIENT_PERSISTENT, $apnsContext );
		
		// Check if we were able to open a socket.
		if (! $apnsSocket)
		{
			Logger::fatal( "APNS Connection Failed: $error $errstr" . PHP_EOL );
			return false;
		}
		Logger::debug('APNS - Socket connection is created');
		Logger::debug('APNS - Sending Data to APNS server : '.$apnsBody);
		
		foreach ($recipient as $apnsToken){
			// Build the Binary Notification.
			$apnsMsg = chr ( 0 ) . chr ( 0 ) . chr ( 32 ) . pack ( 'H*', $apnsToken ) . pack ( 'n', strlen ( $apnsBody ) ) . $apnsBody;
			
			// Send the Notification to the Server.
			$apnsResult = fwrite ( $apnsSocket, $apnsMsg, strlen ( $apnsMsg ) );
			if ($apnsResult){
				Logger::debug('APNS - Message Delivered to device ID: '. $apnsToken);
			}else{
				Logger::error('APNS - Could not Deliver Message to device ID: '. $apnsToken);
			}	
			ob_flush();
			flush();
		}
		fclose ( $apnsSocket );
		// Close the Connection to the Server.
	}	
}