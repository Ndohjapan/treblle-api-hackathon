const en = require("../../locale/en");
const AuthException = require("../error/auth-exception");

const userAuth = async(req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return next(new AuthException(en.authentication_failure));
  }
};

const isAdmin = async(req, res, next) => {
  if(req.user.isAdmin){
    next();
  }
  else{
    return next(new AuthException(en.authentication_forbidden, 403));
  }
};

module.exports = {userAuth, isAdmin};