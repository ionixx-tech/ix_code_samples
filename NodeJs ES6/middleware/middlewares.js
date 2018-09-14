/**
 * Middlewares are defined as array and it will get initialized in app.js while server starts,
 * based on array index order middleware will get executed.
 */
import moment from 'moment';
import logger from  '../services/log'
import dbConnection from '../services/mysql'
import apiResponseConstant from '../constant/apiresponseconstant'
import utility from '../services/utility'
import authTokenModel from '../model/authtoken'
import userModel from '../model/user'
import errors from '../middleware/errors'
import commonConstant from '../constant/commonconstant'
import api from '../middleware/apiResponse'
import redis from '../services/redis'


class middleware {
    constructor () {
        this.middlewares = [
                {
                    description: 'Sets the headers to allow cross-domain requests.',
                    run: function (req, res, next) {
                        logger.info("req.method  ", req.method);
                        logger.info("req.url  ", req.url);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,x-user-token,x-candidate-token');
        
                        if ('OPTIONS' === (req.method || '').toUpperCase()) {
                            return res.status(200).end();
                        }
        
                        next();
                    }
                },
                {
                    description: 'Ignores request for the favicon.',
                    run: function (req, res, next) {
                        if (req.url === '/favicon.ico') {
                            res.writeHead(200, {'Content-Type': 'image/x-icon'});
                            return res.end();
                        }
        
                        next();
                    }
                },
                {
                    description: 'This middleware adds an `$end` method to each response object that maps responses to the `api` service.',
                    run: function (req, res, next) {
        
                        /*
                         * adds a function to the HTTP `response` object, uses the API service to send the proper response
                         * @param data {*} data to send back to client
                         * @returns {*}
                         */
                        res.$end = function (data) {
                            if (data && data instanceof errors.BadRequestError) {
                                return api.sendBadRequest(res, data.message || data);
                            } else if (data && data instanceof errors.PermissionDeniedError) {
                                return api.sendUnauthorizedRequest(res, data.message || data);
                            } else if (data && data instanceof errors.ResourceLockedError) {
                                return api.sendResourceLocked(res, data.message || data);
                            } else if (data && data instanceof errors.ForbiddenError) {
                                return api.sendForbiddenResponse(res, data.message || data);
                            } else if (data && data instanceof errors.ResourceNotFoundError) {
                                return api.sendResourceNotFound(res, data.message || data);
                            } else if (data && data instanceof errors.ResourceNotModifiedError) {
                                return api.sendResourceNotModified(res, data.message || data);
                            } else if (data && data instanceof errors.ServerError) {
                                return api.sendServerError(res, data.message || data);
                            } else if (data && data instanceof Error) {
                                return api.sendErrorResponse(res, data.message || data);
                            } else if (data.code === 9999) {
                                return api.sendValidationError(res,data.message || data)
                            }
                            return api.sendOwnResponse(res, data);
                        };
                        next();
                    }
                },
                {
                    description: "This middleware function will validate the logged in user token",
                    run: function(req, res, next){
                        // Skip auth token verification for these urls
                        if(req.url === '/login') {
                           next();
                        } else {
                            var token = req.headers['x-user-token'];
                            if(token){
                                if(commonConstant.USE_REDIS) {
                                    /* Get the redis connection */
                                redis.getRedisConnection(function(redisErr, redisClient){
                                    if(redisErr){
                                        res.$end(utility.buildResponse(apiResponseConstant.UNKNOWN_ERROR_OCCURRED));
                                    } else {
                                        /* Get the token from redis */
                                        authTokenModel.getRedisToken(redisClient, token)
                                            .then(function(object){
                                                /* Compare the dates */
                                                if(moment(new Date(object.expTime)).isSameOrAfter(moment())){
                                                    req.session = utility.getUserSessionObject(object);
                                                    /* Add expiry time and reset the token in redis */
                                                    let expTime = moment().add(commonConstant.TOKEN_EXTEND_TIME,'m').toString();
                                                    object.expTime = expTime;
                                                    return authTokenModel.setRedisToken(redisClient, token, object)
                                                } else {
                                                    /* Remove the redis token */
                                                    return authTokenModel.removeRedisToken(redisClient, token)
                                                    res.$end(utility.buildResponse(apiResponseConstant.TOKEN_EXPIRED));
                                                }
                                            })
                                            .then(function(){
                                                console.log('Session updated successfully ' + utility.add_minute_current_datetime(commonConstant.TOKEN_EXTEND_TIME));
                                                next();
                                            })
                                            .catch(function(err){
                                                logger.error(err);
                                                res.$end(utility.buildResponse(apiResponseConstant.INVALID_TOKEN));
                                            })
                                        }
                                    });
                                } 
                                else {
                                    var sessionObject = {};
                                    dbConnection.getConnection(true, function (err, connection) {
                                        if (err) {
                                            logger.error(err);
                                            return res.json(utility.buildResponse(apiResponseConstant.UNKNOWN_ERROR_OCCURRED));
                                        } else {
                                            return authTokenModel.checkSession(connection, token)
                                                .then(function (session) {
                                                    if (!session) {
                                                        throw utility.buildResponse(apiResponseConstant.INVALID_TOKEN);
                                                    }
                                                    session.expiry_time = utility.format_date(session.expiry_time);
                                                    sessionObject = session;
                                                    return userModel.findById(connection, sessionObject.user_id)
                                                })
                                                .then(function (user) {
                                                    req.session = utility.getUserSessionObject(user);
                                                    logger.info('\n\nUser Login details : \n',user,'\n\n');
                                                    return authTokenModel.updateSessionExpiryTime(connection,token,utility.add_minute_current_datetime(commonConstant.TOKEN_EXTEND_TIME))
                                                })
                                                .then(function (session) {
                                                    console.log('Session updated successfully ' + utility.add_minute_current_datetime(commonConstant.TOKEN_EXTEND_TIME));
                                                    connection.commit();
                                                    connection.release();
                                                    next();
                                                }).catch(function (error) {
                                                    connection.rollback();
                                                    connection.release();
                                                    return res.json(error);
                                                })
                                            }
                                    })
                                }
                            } else {
                                res.$end(utility.buildResponse(apiResponseConstant.INVALID_TOKEN));
                            }
                        }
                    }
                }
            ]
        }
    }

export default new middleware();
