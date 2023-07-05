const en = require("../../locale/en");

module.exports = function FileUploadException(error) {
  this.status = 400;
  this.errors = error;
  this.message = en.file_upload_error;
};
