const en = require("../../locale/en");

module.exports = function AuthenticationException(message, status) {
  this.status = status || 401;
  this.message = message || en.login_failure;
};
