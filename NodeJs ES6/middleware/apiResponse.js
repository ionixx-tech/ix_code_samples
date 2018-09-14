/**
 * API response helper
 * @module lib/api
 */

import log from '../services/log'
import erroMessages from '../constant/errorconstant'
import utility from '../services/utility'
import apiResponseConstant from '../constant/apiresponseconstant'

class apiResponses {
    /**
 * sets headers on request to allow all request methods and cross-domain requests
 * @param req {Object} request object
 * @param res {Object} response object
 * @param next {Function} next function in chain
 */
    allowCrossDomain(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        next();
    };

/**
 * used to handle server errors
 * @param err {*} error
 * @param req {Object} request object
 * @param res {Object} response object
 * @param next {Function} next function in chain
 */
    handleError(err, req, res, next) {
        res.status(err.status || 500).end(err.message || 'Uh-oh. Something went wrong.');
    };

/**
 * sends a "Bad Request" header to user
 * @param res {Object} response obj
 * @param err {Object} optional error message
 */
    sendServerError(res, err) {
        log.warn('Server Error.', err);
        res.status(500).end(err ? err.toString() : null);
    };

/**
 * sends a "Bad Request" header to user
 * @param res {Object} response obj
 * @param err {Object} optional error message
 */
    sendBadRequest(res, err) {
        log.warn('Bad request made.', err);
        res.status(400).end(err ? err.toString() : null);
    };

/**
 * sends a "Resource Not Found" header to user
 * @param res {Object} response obj
 * @param err {Object} optional error message
 */
    sendUnauthorizedRequest(res, err) {
        log.warn('Unauthorized request made.', err);
        res.status(401).end(err ? err.toString() : null);
    };

/**
 * sends a "Resource Not Found" header to user
 * @param res {Object} response obj
 * @param err {Object} optional error message
 */
    sendResourceNotFound(res, err) {
        log.warn('Resource not found.', err);
        res.status(404).end(err ? err.toString() : null);
    };

/**
 * sends a "Resource Not Found" header to user
 * @param res {Object} response obj
 * @param err {Object} optional error message
 */
    sendResourceLocked(res, err) {
        log.warn('Resource locked.', err);
        res.status(423).end(err ? err.toString() : null);
    };

/**
 * sends a "Resource or action forbidden" header to user
 * @param res {Object} response obj
 * @param err {Object} optional error message
 */
    sendForbiddenResponse(res, err) {
        log.warn('Action forbidden.', err);
        res.status(403).end(err ? err.toString() : null);
    };

/**
 * sends a "Resource not modified" header to user
 * @param res {Object} response obj
 * @param data {Object} data to send
 */
    sendResourceNotModified(res, data) {
        log.warn('Resource not modified.', data);
        res.status(304).end();
    };

/**
 * sends a error header to user
 * @param res {Object} response obj
 * @param err {Object} optional error message
 */
    sendErrorResponse(res, errCode) {
        log.warn('An error occurred on the server.', errCode);
        res.status(erroMessages.errorCodeMapping[errCode]).json({
            code: errCode,
            status: "failure",
            message: erroMessages.errorMessage[errCode]
        });
    };

/**
 * sends a successful response back to the client with an optional payload
 * @param res {Object} response obj
 */
    sendSuccessResponse(res, payload) {
        if (payload === undefined) {
    //     log.debug('Sending empty response.', payload);
            return res.status(204).end();
        } else if (typeof payload === 'number') {
            // log.debug('Sending integer response.', payload);
            return res.status(200).end(payload.toString());
        } else if (typeof payload === 'boolean') {
            // log.debug('Sending boolean response.', payload);
            return res.status(200).end();
        } else if (typeof payload === 'object') {
            // log.debug('Sending json response.', payload);
            return res.status(200).json({code: "0000", status: 'success', data: payload});
        } else {
            // log.debug('Sending non-json response.', payload);
            return res.status(200).end({code: "0000", status: 'success', data: payload});
        }
    };

/**
 * sends a straight response back to the client with an optional payload
 * @param res {Object} response obj
 */
    sendOwnResponse(res, payload) {
        var response = {code: "0000", status: "success"}
        if (payload !== null) {
            if (typeof payload === 'number') {
                // log.debug('Sending integer response.', payload);
                response.data = payload.toString();
            } else if (typeof payload === 'boolean') {
                // log.debug('Sending boolean response.', payload);
                response.data = payload;
            } else if (typeof payload === 'object') {
                if (payload.status && payload.code) {
                    response = payload;
                } else {
                    if (payload.fieldSet) {
                        response.status = "failure";
                        response.code = apiResponseConstant['INVALID_CREDENTIALS'];
                    }
                    response.data = payload;
                }
            } else {
                // log.debug('Sending non-json response.', payload);
                response.data = payload;
            }
        }
        return res.json(response);

    }
/**
 * sends a straight response back to the client with an optional payload
 * @param res {Object} response obj
 */
    sendValidationError(res,payload) {
        var response = {code : 9999,status:"failure"}
        if (payload !== null) {
            if (typeof payload === 'number') {
                // log.debug('Sending integer response.', payload);
                response.message = payload.toString();
            } else if (typeof payload === 'boolean') {
                // log.debug('Sending boolean response.', payload);
                response.message = payload;
            } else if (typeof payload === 'object') {
                response.message = payload.errorMessage;
            } 
        }
        return res.json(response);
    }
}

export default new apiResponses();