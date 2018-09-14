/**
 * Authtoken Model
 * @module model/authtoken
 */

import q from 'q'
import errors from '../../../constant/errorconstant'
import utility from '../../../services/utility'
import apiResponseConstant from '../../../constant/apiresponseconstant'
import logger from '../../../services/log'


export default class authToken {

    /**
     * To check if authtoken exist already
     * @param connection {Object}
     * @param token {String}
     * @returns {tokenCount}
     */
    checkTokenExist(connection, token) {
        let deferred = q.defer();
        let authenticationSql = 'SELECT count(*) from authtoken where authtoken = ? ';
        connection.queryValue(authenticationSql, [token], (err, count) => {
            if (err) {
                deferred.reject(new errors.ServerError("Server Error Occured"));
            }
            else {
                deferred.resolve(count);
            }
        });
        return deferred.promise;
    }

    /**
     * Function to insert the user auth token
     * @param connection
     * @param user_id
     * @param token
     * @param type
     * @param expiry_time
     * @returns {row}
     */
    insert(connection, user_id, token, type, expiry_time) {
        let deferred = q.defer();
        const current_time = utility.current_datetime();
        let insertToken = 'INSERT INTO `authtoken`(user_id,authtoken,auth_type,expiry_time,created_timestamp,updated_timestamp) ' +
            ' VALUES (?,?,?,?,?,?) ;';
        connection.query(insertToken, [user_id, token, type, expiry_time, current_time, current_time], (err, row) => {
            if (err) {
                deferred.reject(new errors.ServerError("Server Error Occured"));
            }
            else {
                deferred.resolve(row);
            }
        });
        return deferred.promise;
    }

    /**
     * Function to set token in redis server
     * @param redisClient
     * @param token
     * @param tokenObj
     *  @returns {token}
     */
    setRedisToken(redisClient, token, tokenObj){
        var deferred = q.defer();
        redisClient.hmset(token, tokenObj, (err, reply) => {
            if(err){
                logger.info("Error setting user token in redis: ", err);
                deferred.reject(utility.buildResponse(apiResponseConstant.UNKNOWN_ERROR_OCCURRED));
            } else {
                logger.info("Reply from hmset redis: ", reply);
                deferred.resolve(token);
            }
        });

        return deferred.promise;
    };

    /**
     * Function to get token from redis server
     * @param redisClient
     * @param token
     * @returns {tokenObject}
     */
    getRedisToken(redisClient, token){
        var deferred = q.defer();
        redisClient.hgetall(token,(err, object) => {
            if(err || object == null){
                logger.info("Redis DB token not found: ", err);
                deferred.reject(utility.buildResponse(apiResponseConstant.UNKNOWN_ERROR_OCCURRED));
            } else {
                logger.info("Reply from hgetall redis: ", object);
                deferred.resolve(object);
            }
        });

        return deferred.promise;
    };

    /**
     * Function to remove token from redis server
     * @param redisClient
     * @param token
     */
    removeRedisToken(redisClient, token){
        var deferred = q.defer();
        redisClient.del(token,(err,reply) => {
            if(!err) {
                if(reply === 1) {
                    logger.info("Reply from del redis: ", reply);
                    deferred.resolve('success');
                } else {
                    logger.info("Redis DB token unable to delete: ", err);
                    deferred.reject(utility.buildResponse(apiResponseConstant.UNKNOWN_ERROR_OCCURRED));
                }
            } else {
                logger.info("Redis DB token not found: ", err);
                deferred.reject(utility.buildResponse(apiResponseConstant.UNKNOWN_ERROR_OCCURRED));
            }
        });

    return deferred.promise;
};

    /**
     * Function to check is session token is valid
     * @param connection
     * @param token
     * @returns {userSessionObject}
     */
    checkSession(connection,token) {
        var deferred = q.defer();
        var sql = 'select user_id,expiry_time from `authtoken` where authtoken = ? and expiry_time > now() LIMIT 0,1'
        connection.queryRow(sql, [token], (err, session) => {
            if (err) {
                logger.error('\n\n');
                logger.error(err);
                deferred.reject(utility.buildResponse(apiResponseConstants.UNKNOWN_ERROR_OCCURRED));
            }
            else {
                deferred.resolve(session);
            }
        })
        return deferred.promise;
    }

    /**
     * Function to update the expiry time for user session
     * @param connection
     * @param token
     * @param expiry_time
     * @returns {userSessionObject}
     */
    updateSessionExpiryTime(connection,token,expiry_time) {
        var deferred = q.defer();
        var updateSql = 'UPDATE `authtoken` set expiry_time = ? , updated_timestamp = NOW() where authtoken = ? '
        connection.query(updateSql, [expiry_time, token], (err, session) => {
            if (err) {
                logger.error(err);
                deferred.reject(utility.buildResponse(apiResponseConstants.UNKNOWN_ERROR_OCCURRED));
            } else {
                deferred.resolve(session);
            }
        })
        return deferred.promise;
    }
}
