const en = require("../../locale/en");

module.exports = function InternalServerError(message) {
	this.status = 500;
	this.message = message || en.server_error;
};
