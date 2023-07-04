const en = require("../../locale/en");

module.exports = function ValidationException(errors) {
  this.status = 400;
  this.errors = errors;
  this.message = en.validation_failure;
};
