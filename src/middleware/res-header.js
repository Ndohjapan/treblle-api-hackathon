const en = require("../../locale/en");
const NotAcceptedException = require("../error/not-accepted-exception");

const methodAllowed = ({methodAllow = "POST"}) => {
  return async function(req, res, next){
    res.setHeader("Allow", methodAllow); 
        
    next();
  };
};

const securityResponseHeader = (req, res, next) => {
  res.setHeader("X-Frame-Options", "deny");
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  next();
};

const setContentType = (req, res, next) => {
  res.setHeader("Accept", "application/json");
  next();
};

const contentTypeHeader = (req, res, next) => {
  const acceptHeader = req.get("Content-Type");
  if (acceptHeader !== "application/json") {
    return next(new NotAcceptedException(en.res_header_not_accepted));
  }
  next();
};



module.exports = {securityResponseHeader, methodAllowed, contentTypeHeader, setContentType};