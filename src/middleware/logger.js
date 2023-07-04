const interceptorParam = (req, res, next) => {

	console.info("\nInterceptorParam-StartRecord------------------------------------------------");
	console.info("InterceptorParam-Access Time   : ", new Date().toLocaleString());
	console.info("InterceptorParam-Req    IP     : ", req.ip);
	console.info("InterceptorParam-Req    Method : ", req.method);
	console.info("InterceptorParam-Access API    : ", getAPIPath(req.originalUrl));
	console.info("InterceptorParam-Req    Body   : ", req.body);
	console.info("InterceptorParam-Req    Params : ", req.params);
	console.info("InterceptorParam-Req    Query  : ", req.query);
	return next();
  
};
  
const getAPIPath = (originalUrl) => {
	if (originalUrl.indexOf("?") > 0) {
		return originalUrl.substring(0, originalUrl.indexOf("?"));
	}
  
	return originalUrl;
};
  
module.exports = {interceptorParam};