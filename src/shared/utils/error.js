/**
 *
 * @param {string} title Title
 * @param {string} message Message Info
 * @param {number} status Status code
 */
function InformationError(title, message, status) {
  this.title = title;
  this.message = message;
  this.status = status;
  this.stack = (new Error()).stack;
}

InformationError.prototype = Object.create(Error.prototype);

InformationError.fromError = function(err, title, status) {
  return new InformationError(title, err.message, status);
};

/**
 * Constructor de clase InformationError.
 *
 * @method constructor.
 */
InformationError.prototype.constructor = InformationError;

module.exports = {
  InformationError: InformationError
};
