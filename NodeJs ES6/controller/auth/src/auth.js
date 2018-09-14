/**
 * Authentication helper library
 * @module controller/auth
 */

import q from 'q'
import dbConnection from '../../../services/mysql'
import utility from '../../../services/utility'
import apiResponseConstant from '../../../constant/apiresponseconstant'
import User from '../../../model/user'
import authTokenModel from '../../../model/authtoken'
import authService from '../../../services/auth'
import redis from '../../../services/redis'
import moment from 'moment'
import logger from '../../../services/log'
import commonConstant from '../../../constant/commonconstant'

export default class authController {

    /**
     * Function to authenticate a user
     * @param email
     * @param password
     * @returns {access_token}
     */
    login(email, password){
        var deferred = q.defer();
        var response = {};
        dbConnection.getConnection(false, function (err, connection) {
            if (err) {
                deferred.reject(utility.buildResponse(apiResponseConstant.UNKNOWN_ERROR_OCCURRED));
            } else {
                User.findByEmail(connection,email).then(function (user) {
                    if(!user){
                        deferred.reject(utility.buildResponse(apiResponseConstant.INVALID_CREDENTIALS));
                    }else if(user.password != password){
                        deferred.reject(utility.buildResponse(apiResponseConstant.INVALID_CREDENTIALS));
                    }else{
                        deferred.resolve(user);
                    }
                    connection.release();
                }).catch(function (e) {
                    connection.release();
                    deferred.reject(utility.buildResponse(apiResponseConstant.UNKNOWN_ERROR_OCCURRED));
                })
            }
        });
        return deferred.promise;
    }

    /**
     * Function to generate and set authtoken for a user
     * @param user
     * @returns {access_token}
     */
    setUserTokenController(user) {
        var deferred = q.defer();
        /* Generate the token */
        authService.generateAccessToken(user.user_id).then(function (token) {
            if(commonConstant.USE_REDIS) {
                /* Get redis connection */
                redis.getRedisConnection(function(redisErr, redisClient){
                    if(redisErr){
                        deferred.reject(utility.buildResponse(apiResponseConstant.UNKNOWN_ERROR_OCCURRED));
                    } else {
                        var tokenObj = {
                            user_id:user.user_id ,
                            name:user.name,
                            email:user.email,
                            expTime: moment().add(commonConstant.TOKEN_EXTEND_TIME,'m').toString()
                        };
                        /* Set the token in redis server */
                        authTokenModel.setRedisToken(redisClient, token, tokenObj)
                        .then(function(){
                            logger.info("Redis token set",token);
                            deferred.resolve(token);
                        })
                        .catch(function(err){
                            logger.error(err);
                            deferred.reject(err);
                        });
                    }
                });
            } else {
                deferred.resolve(token);
            }
        });
        return deferred.promise;
    }
}

