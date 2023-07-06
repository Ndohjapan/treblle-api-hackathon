const en = require("../../locale/en");
const AuthException = require("../error/auth-exception");
const config = require("config");
const jwtConfig = config.get("jwt");
const jwt = require("jsonwebtoken");

const userAuth = async(req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const bearerToken = req.headers.authorization;
            const token = bearerToken.split(" ")[1];
            jwt.verify(token, jwtConfig.secret);
            next();
        } catch (error) {
            return next(new AuthException(en.authentication_failure));
        }
    } else {
        return next(new AuthException(en.authentication_failure));
    }
};

const isAdmin = async(req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        return next(new AuthException(en.authentication_forbidden, 403));
    }
};

module.exports = { userAuth, isAdmin };