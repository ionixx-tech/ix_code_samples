<?php

namespace dao;

class Dao {
	public static function fetchColumn($connection, $sql_query, $data = null) {
		if (! $sql_query) {
			throw new Exception ( "No SQL query!" );
		}
		$sth = $connection->prepare ( $sql_query );
		$sth->execute ( $data );
		return $sth->fetchColumn ();
	}
	public static function executeDMLQuery($connection, $sql_query, $data, $return_rowcount = FALSE) {
		if (! $sql_query) {
			throw new Exception ( "No SQL query!" );
		}
		if (! $data) {
			throw new Exception ( "No data for query!" );
		}
		$sth = $connection->prepare ( $sql_query );
		if ($return_rowcount === FALSE) {
			return $sth->execute ( $data );
		} else {
			$status = $sth->execute ( $data );
			if ($status) {
				return $sth->rowCount ();
			} else {
				return FALSE;
			}
		}
	}
	
	// method to get row of records with parameter $sql_query and parameter $data is set as null
	public static function getRow($connection, $sql_query, $data = null) {
		if (! $sql_query) {
			throw new Exception ( "No SQL query!" );
		}
		$sth = $connection->prepare ( $sql_query );
		$sth->execute ( $data );
		return $sth->fetch ();
	}
	
	// method to get all values with parameter $sql_query and parameter $data is set as null
	public static function getAll($connection, $sql_query, $data = null) {
		if (! $sql_query) {
			throw new Exception ( "No SQL query!" );
		}
		$sth = $connection->prepare ( $sql_query );
		$sth->execute ( $data );
		return $sth->fetchAll ();
	}
	
	// method to get single column values as one dimensional array
	public static function getSingleColumnAsArray($connection, $sql_query, $data = null) {
		if (! $sql_query) {
			throw new Exception ( "No SQL query!" );
		}
		$sth = $connection->prepare ( $sql_query );
		$sth->execute ( $data );
		$rows = $sth->fetchAll ();
		$column_array = array_map ( 'current', $rows );
		return $column_array;
	}
	
	/**
	 * method to update table based on parameters
	 * 
	 * @param
	 *        	$connection
	 * @param $table_name to
	 *        	be updated
	 * @param $primary_key_details -
	 *        	key as primary column name and thier respective values
	 * @param $parameter_details -
	 *        	key as column name and thier respective values
	 */
	public static function updateBasedOnGivenKey($connection, $table_name, $primary_key_details, $parameter_details, $timestamp = []) {
		$param_array = array ();
		
		$sql = "UPDATE `{$table_name}` SET ";
		$update_parameter = [ ];
		if (count ( $parameter_details ) > 0) {
			foreach ( $parameter_details as $key => $value ) {
				$update_parameter [] = "`{$key}` = ? ";
				$param_array [] = $value;
			}
		}
		if (count ( $timestamp ) > 0) {
			foreach ( $timestamp as $value ) {
				$update_parameter [] = "`{$value}` = current_timestamp ";
			}
		}
		$sql .= implode ( ',', $update_parameter );
		if (count ( $primary_key_details ) > 0) {
			$sql .= " WHERE 1=1 ";
			foreach ( $primary_key_details as $key => $value ) {
				$sql .= " AND {$key} = ?";
				$param_array [] = $value;
			}
		}
		self::executeDMLQuery ( $connection, $sql, $param_array );
	}
}