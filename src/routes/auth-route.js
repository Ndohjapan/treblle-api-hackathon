const {
  validateUserLoginInput,
  validateUserSignupInput,
} = require("../middleware/auth-input-validator");
const catchAsync = require("../util/catch-async");
const passport = require("passport");
const { rateLimiter } = require("../middleware/rate-limiter");
const { AuthService } = require("../service/auth-service");
const en = require("../../locale/en");
const {methodAllowed, contentTypeHeader, setContentType} = require("../middleware/res-header");

module.exports = async (app) => {
  const service = new AuthService();

  app.use(methodAllowed({methodAllow: "POST"}));
  app.use(setContentType);
  app.use(contentTypeHeader);

  app.post(
    "/api/1.0/signup",
    rateLimiter({ secondsWindow: 300, allowedHits: 5 }),
    validateUserSignupInput,
    catchAsync(async (req, res) => {
      const userInput = req.body;

      await service.UserSignUp(userInput);

      res.send({message: en.signup_successful});
    })
  );

  app.post(
    "/api/1.0/login",
    rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
    validateUserLoginInput,
    catchAsync(async (req, res, next) => {
      // eslint-disable-next-line no-unused-vars
      passport.authenticate("user", (err, user, info) => {
        if (err) {
          return next(err);
        }
        return req.logIn(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }
          return res.send(user);
        });
      })(req, res, next);
    })
  );

  // eslint-disable-next-line no-unused-vars
  app.post(
    "/api/1.0/logout",
    rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
    catchAsync(async (req, res, next) => {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.status(204).send();
      });
    })
  );
};
