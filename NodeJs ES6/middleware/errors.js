/**
 * error; signifies a bad HTTP request from a client
 * @param message {*} error object or descriptive error message
 * @returns {BadRequestError}
 * @constructor
 */
var BadRequestError = function(message) {
  if (!(this instanceof BadRequestError)) {
    return new BadRequestError(message);
  }

  if (message && message.message) {
    this.message = message.message;
  } else if (message) {
    this.message = message;
  } else {
    this.message = 'Bad request made.';
  }

  this.status = 400;
  return this;
};

/**
 * error; signifies an unauthorized HTTP request from a client
 * @param message {*} error object or descriptive error message
 * @returns {PermissionDeniedError}
 * @constructor
 */
var PermissionDeniedError = function(message) {
  if (!(this instanceof PermissionDeniedError)) {
    return new PermissionDeniedError(message);
  }

  if (message && message.message) {
    this.message = message.message;
  } else if (message) {
    this.message = message;
  } else {
    this.message = 'Permission denied.';
  }

  this.status = 401;
  return this;
};

/**
 * error; signifies the server couldn't find the requested object from a client
 * @param message {*} error object or descriptive error message
 * @returns {ResourceNotFoundError}
 * @constructor
 */
var ResourceNotFoundError = function(message) {
  if (!(this instanceof ResourceNotFoundError)) {
    return new ResourceNotFoundError(message);
  }

  if (message && message.message) {
    this.message = message.message;
  } else if (message) {
    this.message = message;
  } else {
    this.message = 'Resource not found.';
  }

  this.status = 404;
  return this;
};

/**
 * error; signifies the resource is currently locked
 * @param message {*} error object or descriptive error message
 * @returns {ResourceLockedError}
 * @constructor
 */
var ResourceLockedError = function(message) {
  if (!(this instanceof ResourceLockedError)) {
    return new ResourceLockedError(message);
  }

  if (message && message.message) {
    this.message = message.message;
  } else if (message) {
    this.message = message;
  } else {
    this.message = 'Resource locked.';
  }

  this.status = 423;
  return this;
};

/**
 * error; signifies the resource or action is forbidden
 * @param message {*} error object or descriptive error message
 * @returns {ForbiddenError}
 * @constructor
 */
var ForbiddenError = function(message) {
  if (!(this instanceof ForbiddenError)) {
    return new ForbiddenError(message);
  }

  if (message && message.message) {
    this.message = message.message;
  } else if (message) {
    this.message = message;
  } else {
    this.message = 'Resource forbidden.';
  }

  this.status = 403;
  return this;
};

/**
 * error; signifies the resource has not been modified
 * @param message {*} error object or descriptive error message
 * @returns {ResourceNotModifiedError}
 * @constructor
 */
var ResourceNotModifiedError = function(message) {
  if (!(this instanceof ResourceNotModifiedError)) {
    return new ResourceNotModifiedError(message);
  }

  if (message && message.message) {
    this.message = message.message;
  } else if (message) {
    this.message = this.data = message;
  } else {
    this.message = 'Resource not modified.';
  }

  this.status = 304;
  return this;
};

/**
 * error; signifies the server couldn't encountered an error while responding to the client
 * @param message {*} error object or descriptive error message
 * @returns {ServerError}
 * @constructor
 */
var ServerError = function(message) {
  if (!(this instanceof ServerError)) {
    return new ServerError(message);
  }

  if (message && message.message) {
    this.message = message.message;
  } else if (message) {
    this.message = message;
  } else {
    this.message = 'Server error occurred.';
  }

  this.status = 500;
  return this;
};
/**
 * override of the `toString() function, sends back a descriptive error message
 * @type {String}
 */
BadRequestError.toString =
  PermissionDeniedError.toString =
    ResourceNotFoundError.toString =
      ResourceLockedError.toString =
        ForbiddenError.toString =
          ResourceNotModifiedError.toString =
            ServerError.toString = function() {
              return this.message;
            };

exports.BadRequestError = BadRequestError;
exports.PermissionDeniedError = PermissionDeniedError;
exports.ResourceNotFoundError = ResourceNotFoundError;
exports.ResourceLockedError = ResourceLockedError;
exports.ForbiddenError = ForbiddenError;
exports.ResourceNotModifiedError = ResourceNotModifiedError;
exports.ServerError = ServerError;