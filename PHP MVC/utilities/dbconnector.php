<?php

namespace utilities;

use utilities\Logger;

class DbConnector {
	
	/**
	 *
	 * @var declared as protected
	 */
	private static $connection;
	
	// method to initialise
	private static function _init() {
		if (! self::$connection) {
			try {
				$dsn = 'mysql:host=' . DATABASE_HOST . ';dbname=' . DATABASE_INSTANCE_NAME . ';charset=utf8';
				self::$connection = new \PDO ( $dsn, DATABASE_USER_NAME, DATABASE_USER_PASSWORD );
				self::$connection->setAttribute ( \PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION );
				self::$connection->setAttribute ( \PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC );
				self::$connection->setAttribute ( \PDO::ATTR_EMULATE_PREPARES, false );
			} catch ( PDOException $e ) {
				Logger::fatal ( "Database Connection error", $e );
				die ( 'Connection error: ' . $e->getMessage () );
			}
		}
		return self::$connection;
	}
	// method to get connection
	public static function getConnection() {
		return self::_init ();
	}
	
	// method to commit transaction with parameter $connectionObj as parameter
	public static function beginTransaction(\PDO $connectionObj) {
		if (isset ( $connectionObj )) {
			$connectionObj->beginTransaction ();
		}
	}
	
	// method to commit transaction with parameter $connectionObj as parameter
	public static function commitTransaction(\PDO $connectionObj, $close_connection=false) {
		if (isset ( $connectionObj ) && $connectionObj->inTransaction ()) {
			$connectionObj->commit ();
			if($close_connection){
				self::closeConnection();
			}
		} else {
			Logger::error ( "PDO : Committing transaction without active transacttion", new \Exception () );
		}
	}
	
	// method to rollback transaction with $connectionObj as parameter
	public static function rollbackTransaction(\PDO $connectionObj, $close_connection=false) {
		if (isset ( $connectionObj ) && $connectionObj->inTransaction ()) {
			$connectionObj->rollBack ();
			if($close_connection){
				self::closeConnection();
			}
		} else {
			Logger::error ( "PDO : Rollbacking transaction without active transacttion", new \Exception () );
		}
	}
	
	// method to get connection for proxy
	public static function getProxyConnection() {
		try {
			$dsn = 'mysql:host=' . DATABASE_HOST . ';dbname=' . DATABASE_INSTANCE_NAME . ';charset=utf8';
			$proxyConnection = new \PDO ( $dsn, DATABASE_USER_NAME, DATABASE_USER_PASSWORD );
			$proxyConnection->setAttribute ( \PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION );
			$proxyConnection->setAttribute ( \PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC );
			return $proxyConnection;
		} catch ( PDOException $e ) {
			Logger::fatal ( "Database Connection error", $e );
			die ( 'Connection error: ' . $e->getMessage () );
		}
	}
	
	// method to close connection
	public static function closeConnection() {
		self::$connection = null;
	}
	
	// method to check transaction is in progress
	public static function checkTransaction(\PDO $connectionObj) {
		return $connectionObj->inTransaction ();
	}
}