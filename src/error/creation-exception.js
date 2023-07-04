const en = require("../../locale/en");

module.exports = function CreationException(message, status) {
  this.status = status || 409;
  this.message = message || en.user_creation_error;
};
