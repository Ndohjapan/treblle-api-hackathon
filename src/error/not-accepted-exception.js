module.exports = function NotAcceptedException(message) {
  this.status = 406;
  this.message = message;
};
  