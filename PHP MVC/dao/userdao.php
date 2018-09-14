<?php

namespace dao;

use utilities\constant\CommonConstant;
use utilities\UtilityMethods;
use utilities\constant\SocialgroupConstant;

class UserDao extends Dao {
	
	public static function authenticate($connection, $parameter) {
		$sql_query = " Select * from `user` as t1 where t1.`username` = ?  and t1.`password` = ? AND t1.`is_deleted` = 0 ";
		$data = [ 
				$parameter ['username'],
				$parameter ['password'] 
		];
		return self::getRow ( $connection, $sql_query, $data );
	}
	
	public static function authenticate_authtoken($connection, $parameter) {
		$sql_query = " Select * from `user` as t1 join `user_token_info` as uti where t1.`user_id`=uti.`user_id  and uti.`auth_token` = ? AND t1.`is_deleted` = 0 ";
		$data = [
				$parameter ['auth_token']
		];
		return self::getRow ( $connection, $sql_query, $data );
	}
	
	
	public static function insert_user_token_info($connection,$parameter){
		$sql_query = "REPLACE INTO `user_token_info` (`auth_token`,`user_id`,`last_updated`,`created_at`) VALUES(?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP )";
		$data = array($parameter['auth_token'],$parameter['user_id']);
		self::executeDMLQuery($connection,$sql_query, $data);
	}
	
	public static function check_authtoken_exist($connection,$auth_token){
		$sql_query = "SELECT COUNT(*) FROM `user_token_info` WHERE `auth_token` = ? ";
		$data = array($auth_token);
		return self::fetchColumn($connection,$sql_query, $data);
	}
	
	public static function check_user_identifier($connection, $user_identifier){
		$sql_query = "SELECT count(1) from `user` where user_identifier = ? ";
		$data = array($user_identifier);
		return self::fetchColumn($connection,$sql_query, $data);
	}
	
	public static function insert($connection, $parameter) {
		$sql_query = "INSERT INTO `user` ( `user_name`, `country_code`, `mobile_number`, `email_id`, `gender`, `user_identifier`, `secret_key`,`device_notification_key`, `device_id`, `device_type`, `last_updated_stamp`, `created_stamp`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
		$data = [ 
				$parameter ['user_name'],
				$parameter ['country_code'],
				$parameter ['mobile_number'],
				$parameter ['email_id'],
				$parameter ['gender'],
				$parameter ['user_identifier'],
				$parameter ['secret_key'],
				$parameter ['device_notification_key'],
				$parameter ['device_id'],
				$parameter ['device_type'],
		];
		self::executeDMLQuery ( $connection, $sql_query, $data );
		return $connection->lastInsertId ();
	}
	
	public static function get_all($connection, $filter, $count = false) {
		$sql_query = " Select * from `user` as m1 where 1=1  AND m1.`delete_status` = 0 ";
		$data = [ ];
		if (! empty ( $filter ['search_keyword'] )) {
			$sql_query .= " HAVING ";
			$search_keyword = '%' . $filter ['search_keyword'] . '%';
			$sql_query .= " ( ";
			$sql_query .= "user_name like ? ";
			$sql_query .= " OR mobile_number like ? ";
			$sql_query .= " OR email_id like ? ";
			$sql_query .= " )";
			$data [] = $search_keyword;
			$data [] = $search_keyword;
			$data [] = $search_keyword;
		}
		if (! empty ( $filter ['field_search_keyword'] )) {
			$sql_query .= " HAVING ";
			$sql_query .= " ( ";
			foreach ( $filter ['field_search_keyword'] as $field => $searchvalue ) {
				$sql_query .= $field . " like ? ";
				$data [] = '%' . $searchvalue . '%';
				$sql_query .= " AND ";
			}
			$sql_query = rtrim ( $sql_query, " AND " );
			$sql_query .= ")";
		}
		if ($count) {
			$sql_query = " select count(*) from ({$sql_query}) tmp";
			return self::fetchColumn ( $connection, $sql_query, $data );
		}
		$fields = UtilityMethods::get_value_from_array ( $filter, CommonConstant::QUERY_PARAM_FIELDS, '*' );
		$sql_query = " select " . $fields . " from ({$sql_query}) tmp";
		if (isset ( $filter [CommonConstant::QUERY_PARAM_SORT_BY] ) && isset ( $filter [CommonConstant::QUERY_PARAM_SORT_ORDER] )) {
			$sql_query .= " ORDER BY {$filter[CommonConstant::QUERY_PARAM_SORT_BY]}  {$filter[CommonConstant::QUERY_PARAM_SORT_ORDER]}";
		}
		if (isset ( $filter [CommonConstant::QUERY_PARAM_LIMIT] ) && isset ( $filter [CommonConstant::QUERY_PARAM_OFFSET] )) {
			$sql_query .= " LIMIT {$filter[CommonConstant::QUERY_PARAM_OFFSET]} , {$filter[CommonConstant::QUERY_PARAM_LIMIT]}";
		}
		return self::getAll ( $connection, $sql_query, $data );
	}
	
	public static function getDetails($connection, $user_id, $self_info) {
		
		if($self_info){
			$fields = ' `user_name`,`country_code`,`mobile_number`,IFNULL(`email_id`, "") as email_id , IF(`gender`=1, "male", "female") as gender, IF(`is_memory_retain`=1, "true", "false") as memory_retain, `user_identifier`, `profile_image_identifier` ';
		}else{
			$fields = ' `user_name`,`user_identifier`, `profile_image_identifier` ';
		}
		
		$sql_query = "  SELECT 
							{$fields}, 
							(SELECT COUNT(1) FROM `user_follow` WHERE `followed_user_id` = `user_id` AND `is_active` = 1 ) AS follower_count,
							(SELECT COUNT(1) FROM `user_follow` WHERE `follower_user_id` = `user_id` AND `is_active` = 1 ) AS following_count
						FROM `user`
						WHERE `user_id` = ? AND `delete_status` = 0 ";
		$data = [ 
				$user_id 
		];
		return self::getRow ( $connection, $sql_query, $data );
	}
	
	public static function get_details_by_mobile_numbers($connection, $mobile_numbers) {
		$qMarks = str_repeat('?,', count($mobile_numbers) - 1) . '?';
		
		$sql_query = " select user_name, user_identifier, profile_image_identifier, CONCAT(`country_code`, `mobile_number`) as mobile_number  from `user` where CONCAT(`country_code`, `mobile_number`) in ({$qMarks})  AND `delete_status` = 0 ";
		return self::getAll ( $connection, $sql_query, $mobile_numbers);
	}
	
	public static function get_user_id_by_mobile_number($connection, $mobile_number) {
		$sql_query = " select user_id from `user` where CONCAT(`country_code`, `mobile_number`) = ? AND `delete_status` = 0 ";
		return self::fetchColumn ( $connection, $sql_query, array($mobile_number));
	}
	
	public static function get_user_details_by_mobile_number($connection, $mobile_number) {
		$sql_query = " select * from `user` where CONCAT(`country_code`, `mobile_number`) = ? ";
		return self::getRow ( $connection, $sql_query, array($mobile_number));
	}
	
	public static function get_user_details_for_validate($connection, $device_notification_key, $device_id) {
		$sql_query = " select * from `user` where device_notification_key = ? AND device_id = ? ";
		return self::getRow ( $connection, $sql_query, array($device_notification_key, $device_id));
	}
	
	public static function get_details_by_field_string($connection, $user_id, $field_string = "*") {
		$sql_query = " Select " . $field_string . " from `user` where `user_id` = ?  AND `delete_status` = 0 ";
		$data = [ 
				$user_id 
		];
		return self::getRow ( $connection, $sql_query, $data );
	}
	
	public static function get_user_id($connection, $user_identifier) {
		$sql_query = " Select `user_id` from `user` where `user_identifier` = ?  AND `delete_status` = 0 ";
		$data = [ 
				$user_identifier 
		];
		return self::fetchColumn ( $connection, $sql_query, $data );
	}
	
	public static function get_user_details_by_identifier($connection, $user_identifier) {
		$sql_query = " Select * from `user` where `user_identifier` = ?  AND `delete_status` = 0 ";
		$data = [
				$user_identifier
		];
		return self::getRow( $connection, $sql_query, $data );
	}
	
	public static function get_notification_keys($connection, $user_ids, $device_type) {
		if(empty($user_ids)){
			return;
		}
		$qMarks = str_repeat('?,', count($user_ids) - 1) . '?';
		$sql_query = " Select `device_notification_key` from `user` where `user_id` IN ({$qMarks}) AND `delete_status` = 0 AND `device_type` = ? ";
		$data = array_merge($user_ids, array($device_type));
		return self::getSingleColumnAsArray( $connection, $sql_query, $data );
	}
	
	public static function get_notification_key($connection, $user_id) {
		$sql_query = " Select `device_notification_key`, `device_type` from `user` where `user_id` = ? AND `delete_status` = 0 ";
		$data = array($user_id);
		return self::getRow( $connection, $sql_query, $data );
	}
	
	public static function get_notification_keys_by_social_group($connection, $social_group_ids, $user_id, $device_type) {
		if(empty($social_group_ids)){
			return;
		}
		$qMarks = str_repeat('?,', count($social_group_ids) - 1) . '?';
		$sql_query = "SELECT device_notification_key FROM (
						SELECT user_id, `device_notification_key` FROM `user` WHERE `user_id`IN (SELECT `user_id` FROM `social_group_contact` WHERE `social_group_id` IN ({$qMarks}))  AND `delete_status` = 0 AND `device_type` = ?
						UNION ALL
						SELECT user_id, `device_notification_key` FROM `user` WHERE `user_id` IN (SELECT sg.`user_id` FROM `social_group` sg WHERE `social_group_id` IN ({$qMarks}) AND sg.`is_active` = 1 AND sg.`group_type` = ?) AND `delete_status` = 0 AND `device_type` = ?
					 ) tmp WHERE user_id <> ? ";
		$data = array_merge(
				$social_group_ids, 
				array($device_type),
				$social_group_ids,
				array(SocialgroupConstant::GROUP_TYPE_OPEN, $device_type, $user_id)
			);
		return self::getSingleColumnAsArray( $connection, $sql_query, array_values($data) );
	}
	
	public static function get_following_user_notification_key($connection, $user_id, $device_type) {
		$sql_query = " SELECT `device_notification_key` FROM `user` WHERE `delete_status` = 0  AND `device_type` = ? AND `user_id` IN (SELECT `follower_user_id` FROM `user_follow` WHERE `followed_user_id` = ? AND `is_active` = 1) ";
		$data = array($device_type, $user_id);
		return self::getSingleColumnAsArray( $connection, $sql_query, $data );
	}
	
	public static function delete($connection, $user_id) {
		$sql_query = "UPDATE `user` set `delete_status` = 1, last_updated_stamp = current_timestamp  where `user_id` = ? ";
		$data = [ 
				$user_id 
		];
		return self::executeDMLQuery ( $connection, $sql_query, $data );
	}
}